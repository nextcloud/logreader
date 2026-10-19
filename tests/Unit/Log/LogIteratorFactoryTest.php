<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\LogReader\Tests\Unit\Log;

use OCA\LogReader\Log\LogIteratorFactory;
use OCP\IConfig;
use OCP\Log\IFileBased;
use OCP\Log\ILogFactory;
use OCP\Log\IWriter;
use PHPUnit\Framework\Attributes\DataProvider;
use Test\TestCase;

class LogIteratorFactoryTest extends TestCase {
	private string $logFile;
	private LogIteratorFactory $logIteratorFactory;

	protected function setUp(): void {
		parent::setUp();

		$this->logFile = tempnam(sys_get_temp_dir(), 'logreader');

		$config = $this->createStub(IConfig::class);
		$config->method('getSystemValue')
			->willReturnCallback(fn (string $key, mixed $default) => $default);

		$log = $this->createStubForIntersectionOfInterfaces([IWriter::class, IFileBased::class]);
		$log->method('getLogFilePath')
			->willReturn($this->logFile);

		$logFactory = $this->createStub(ILogFactory::class);
		$logFactory->method('get')
			->willReturn($log);

		$this->logIteratorFactory = new LogIteratorFactory($config, $logFactory);
	}

	protected function tearDown(): void {
		unlink($this->logFile);
		parent::tearDown();
	}

	public static function levelsProvider(): array {
		return [
			'all levels, the default' => ['levels' => [0, 1, 2, 3, 4], 'expectedReqIds' => ['8', '7', '1']],
			'warning and above' => ['levels' => [2, 3, 4], 'expectedReqIds' => ['8', '1']],
		];
	}

	#[DataProvider(methodName: 'levelsProvider')]
	public function testReturnsOnlyLogEntriesOfTheRequestedLevels(array $levels, array $expectedReqIds): void {
		file_put_contents($this->logFile, implode("\n", [
			'{"reqId":"1","level":3,"time":"2019-11-04T18:50:57+00:00","app":"files","message":"Error"}',
			'"text"',
			'123',
			'[1,2]',
			'not json',
			'{"reqId":"6","time":"2019-11-04T18:50:57+00:00","app":"files","message":"No level"}',
			'{"reqId":"7","level":1,"time":"2019-11-04T18:50:57+00:00","app":"files","message":"Info"}',
			'{"reqId":"8","level":2,"time":"2019-11-04T18:50:57+00:00","app":"files","message":"Warning"}',
		]));

		set_error_handler(static function (int $level, string $message): never {
			throw new \ErrorException($message, 0, $level);
		});
		try {
			$entries = iterator_to_array($this->logIteratorFactory->getLogIterator($levels), false);
		} finally {
			restore_error_handler();
		}

		$this->assertSame($expectedReqIds, array_column($entries, 'reqId'));
	}
}
