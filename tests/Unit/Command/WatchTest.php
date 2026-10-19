<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\LogReader\Tests\Unit\Command;

use OCA\LogReader\Command\Watch;
use OCA\LogReader\Log\Formatter;
use OCA\LogReader\Log\LogIteratorFactory;
use OCP\IConfig;
use OCP\Log\IFileBased;
use OCP\Log\ILogFactory;
use OCP\Log\IWriter;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;
use Test\TestCase;

class WatchTest extends TestCase {
	private string $logFile;

	protected function setUp(): void {
		parent::setUp();

		if (!function_exists('pcntl_signal')) {
			$this->markTestSkipped('log:watch can only be stopped with the pcntl extension');
		}
		$this->logFile = tempnam(sys_get_temp_dir(), 'logreader');
	}

	protected function tearDown(): void {
		// Command::run() installs signal handlers for the command, restore the defaults for PHPUnit
		pcntl_signal(SIGINT, SIG_DFL);
		pcntl_signal(SIGTERM, SIG_DFL);
		unlink($this->logFile);

		parent::tearDown();
	}

	/**
	 * Runs log:watch --raw while the log grows. Every check for a new entry reads the log once,
	 * and once more if it found one: the first read of the n-th check appends $appendedLines[n] first.
	 * Stops after the last appended lines were printed.
	 *
	 * @param list<string> $appendedLines
	 * @return list<array> the printed entries
	 */
	private function watchGrowingLog(string $log, array $appendedLines): array {
		file_put_contents($this->logFile, $log);

		$config = $this->createStub(IConfig::class);
		$config->method('getSystemValue')
			->willReturnCallback(fn (string $key, mixed $default) => $default);

		$fileLog = $this->createStubForIntersectionOfInterfaces([IWriter::class, IFileBased::class]);
		$fileLog->method('getLogFilePath')
			->willReturn($this->logFile);

		$watch = null;
		$reads = 0;
		$logFactory = $this->createStub(ILogFactory::class);
		$logFactory->method('get')
			->willReturnCallback(function () use (&$reads, &$watch, $appendedLines, $fileLog) {
				$reads++;
				// The first read is the initial one, then each check that finds a new entry reads twice
				$check = intdiv($reads, 2);
				if ($reads % 2 === 0 && isset($appendedLines[$check - 1])) {
					file_put_contents($this->logFile, "\n" . $appendedLines[$check - 1], FILE_APPEND);
				}
				if ($check > count($appendedLines)) {
					$watch->cancelOperation();
				}
				return $fileLog;
			});

		$watch = new Watch(new Formatter(\OC::$SERVERROOT), new LogIteratorFactory($config, $logFactory));
		$output = new BufferedOutput();

		$watch->run(new ArrayInput(['--raw' => true]), $output);

		return array_map(fn (string $line) => json_decode($line, true), array_values(array_filter(explode("\n", $output->fetch()))));
	}

	public function testPrintsNewEntriesInOrder(): void {
		$entries = $this->watchGrowingLog(
			'{"reqId":"1","level":3,"time":"2019-11-04T18:50:57+00:00","app":"files","message":"Entry 1"}',
			[
				'{"reqId":"2","level":3,"time":"2019-11-04T18:50:58+00:00","app":"files","message":"Entry 2"}',
				'{"reqId":"3","level":3,"time":"2019-11-04T18:50:59+00:00","app":"files","message":"Entry 3"}' . "\n"
					. '{"reqId":"4","level":3,"time":"2019-11-04T18:51:00+00:00","app":"files","message":"Entry 4"}',
			],
		);

		$this->assertSame(['2', '3', '4'], array_column($entries, 'reqId'));
	}

	public function testHandlesEntriesWithoutReqIdWithoutWarnings(): void {
		set_error_handler(static function (int $level, string $message): never {
			throw new \ErrorException($message, 0, $level);
		});
		try {
			$entries = $this->watchGrowingLog(
				'{"reqId":"1","level":3,"time":"2019-11-04T18:50:57+00:00","app":"files","message":"Entry 1"}',
				[
					'{"level":3,"time":"2019-11-04T18:50:58+00:00","app":"files","message":"No request id"}',
					'{"reqId":"3","level":3,"time":"2019-11-04T18:50:59+00:00","app":"files","message":"Entry 3"}',
				],
			);
		} finally {
			restore_error_handler();
		}

		$this->assertSame(['No request id', 'Entry 3'], array_column($entries, 'message'));
	}
}
