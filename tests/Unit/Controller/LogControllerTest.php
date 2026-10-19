<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\LogReader\Tests\Unit\Controller;

use OCA\LogReader\Controller\LogController;
use OCA\LogReader\Log\LogIterator;
use OCA\LogReader\Log\LogIteratorFactory;
use OCA\LogReader\Service\SettingsService;
use OCP\AppFramework\Http\IOutput;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\Http\Response;
use OCP\AppFramework\Http\StreamTraversableResponse;
use OCP\IRequest;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\MockObject\MockObject;
use Psr\Log\LoggerInterface;
use Test\TestCase;

class LogControllerTest extends TestCase {

	private LogController $logController;

	/** @var LogIteratorFactory|MockObject */
	private $logIteratorFactory;

	/** @var SettingsService|MockObject */
	private $settingsService;

	/** @var LoggerInterface|MockObject */
	private $logger;

	/** @var IRequest|MockObject */
	private $request;

	protected function setUp(): void {
		parent::setUp();

		$this->logIteratorFactory = $this->createStub(LogIteratorFactory::class);
		$this->settingsService = $this->createStub(SettingsService::class);
		$this->logger = $this->createStub(LoggerInterface::class);
		$this->request = $this->createStub(IRequest::class);

		$this->settingsService->method('getLoggingType')->willReturn('file');
		$this->settingsService->method('getShownLevels')->willReturn([0, 1, 2, 3, 4]);

		$this->logController = new LogController(
			'logreader',
			$this->request,
			$this->logIteratorFactory,
			$this->settingsService,
			$this->logger,
		);
	}

	private function getLogIterator(string $log): LogIterator {
		$handle = fopen('php://temp', 'r+');
		fwrite($handle, $log);
		rewind($handle);
		return new LogIterator($handle, \DateTime::ATOM, 'UTC');
	}

	/**
	 * Every call to the factory must return a freshly rewound iterator over
	 * the same log content, mirroring how the real factory opens the log
	 * file anew for each call.
	 */
	private function mockLogWithEntries(string $log): void {
		$this->logIteratorFactory->method('getLogIterator')
			->willReturnCallback(fn () => $this->getLogIterator($log));
	}

	private function getLogWithEntries(int $count): string {
		$lines = [];
		for ($reqId = 1; $reqId <= $count; $reqId++) {
			$lines[] = '{"reqId":"' . $reqId . '","level":3,"time":"2019-11-04T18:50:57+00:00","app":"files","message":"Entry ' . $reqId . '"}';
		}
		return implode("\n", $lines);
	}

	/**
	 * @return list<string> the parts the response sends, in order
	 */
	private function getOutputParts(StreamTraversableResponse $response): array {
		$parts = [];
		$output = $this->createStub(IOutput::class);
		$output->method('setOutput')
			->willReturnCallback(function (string $part) use (&$parts): void {
				$parts[] = $part;
			});
		$response->callback($output);
		return $parts;
	}

	private function getResponseData(Response $response): mixed {
		if ($response instanceof JSONResponse) {
			return $response->getData();
		}
		$this->assertInstanceOf(StreamTraversableResponse::class, $response);
		return json_decode(implode('', $this->getOutputParts($response)), true, flags: JSON_THROW_ON_ERROR);
	}

	public function testGetReturnsNewestEntriesFirst(): void {
		$this->mockLogWithEntries($this->getLogWithEntries(3));

		$response = $this->logController->get();
		$data = $this->getResponseData($response);

		$this->assertSame('application/json; charset=utf-8', $response->getHeaders()['Content-Type']);
		$this->assertSame(['3', '2', '1'], array_column($data['data'], 'reqId'));
		$this->assertSame('Entry 3', $data['data'][0]['message']);
		$this->assertCount(3, array_unique(array_column($data['data'], 'id')));
		$this->assertFalse($data['remain']);
	}

	public function testGetReturnsRequestedPage(): void {
		$this->mockLogWithEntries($this->getLogWithEntries(5));

		$data = $this->getResponseData($this->logController->get('', 2, 1));

		$this->assertSame(['4', '3'], array_column($data['data'], 'reqId'));
		$this->assertTrue($data['remain']);
	}

	public function testGetReturnsEmptyPageForEmptyLog(): void {
		$this->mockLogWithEntries('');

		$data = $this->getResponseData($this->logController->get());

		$this->assertSame(['data' => [], 'remain' => false], $data);
	}

	public function testGetFiltersBySearchQuery(): void {
		$this->mockLogWithEntries($this->getLogWithEntries(12));

		$data = $this->getResponseData($this->logController->get('Entry 1'));

		$this->assertSame(['12', '11', '10', '1'], array_column($data['data'], 'reqId'));
	}

	public function testGetSendsEachEntrySeparately(): void {
		$this->mockLogWithEntries($this->getLogWithEntries(3));

		$response = $this->logController->get();

		$this->assertInstanceOf(StreamTraversableResponse::class, $response);
		// The opening, one part per entry and the closing with "remain"
		$this->assertCount(5, $this->getOutputParts($response));
	}

	public function testGetEscapesHtmlLikeJsonResponse(): void {
		$this->mockLogWithEntries('{"reqId":"1","level":3,"time":"2019-11-04T18:50:57+00:00","app":"files","message":"<script>alert(1)</script>"}');

		$response = $this->logController->get();

		$this->assertInstanceOf(StreamTraversableResponse::class, $response);
		$json = implode('', $this->getOutputParts($response));
		$this->assertStringNotContainsString('<script>', $json);
		$this->assertStringContainsString(trim((new JSONResponse('<script>alert(1)</script>'))->render(), '"'), $json);
	}

	public function testGetKeepsPagesConsecutiveWithAnEntryThatCannotBeEncoded(): void {
		// 1e999 is too large for a float and decodes to INF, which JSON cannot represent
		$this->mockLogWithEntries(implode("\n", [
			'{"reqId":"1","level":3,"time":"2019-11-04T18:50:57+00:00","app":"files","message":"Entry 1"}',
			'{"reqId":"2","level":3,"time":"2019-11-04T18:50:57+00:00","app":"files","message":"Entry 2"}',
			'{"reqId":"3","level":3,"time":"2019-11-04T18:50:57+00:00","app":"files","message":1e999}',
			'{"reqId":"4","level":3,"time":"2019-11-04T18:50:57+00:00","app":"files","message":"Entry 4"}',
		]));

		// Like the frontend, request the next page at the number of entries received so far
		$firstPage = $this->getResponseData($this->logController->get('', 2, 0));
		$secondPage = $this->getResponseData($this->logController->get('', 2, count($firstPage['data'])));

		$this->assertSame(['4', '3', '2', '1'], array_column([...$firstPage['data'], ...$secondPage['data']], 'reqId'));
		$this->assertSame(0, $firstPage['data'][1]['message']);
		$this->assertFalse($secondPage['remain']);
	}

	public function testPollIncludesTheNewestLogEntry(): void {
		$log = '{"reqId":"1","level":3,"time":"2019-11-04T18:50:57+00:00","app":"comments"}' . "\n"
			. '{"reqId":"2","level":3,"time":"2019-11-04T18:50:58+00:00","app":"gallery"}' . "\n"
			. '{"reqId":"3","level":3,"time":"2019-11-04T18:50:59+00:00","app":"files"}';
		$this->mockLogWithEntries($log);

		$response = $this->logController->poll('1');
		$data = $this->getResponseData($response);

		$this->assertCount(2, $data);
		// sorted newest first, the last written entry (reqId 3) must be included
		$this->assertEquals('3', $data[0]['reqId']);
		$this->assertEquals('2', $data[1]['reqId']);
	}

	public function testPollReturnsEmptyWhenThereIsNoNewEntry(): void {
		$log = '{"reqId":"1","level":3,"time":"2019-11-04T18:50:57+00:00","app":"comments"}';
		$this->mockLogWithEntries($log);

		$response = $this->logController->poll('1');

		$this->assertEquals([], $this->getResponseData($response));
	}

	public function testPollSendsEachNewEntrySeparately(): void {
		$this->mockLogWithEntries($this->getLogWithEntries(4));

		$response = $this->logController->poll('2');

		$this->assertInstanceOf(StreamTraversableResponse::class, $response);
		$parts = $this->getOutputParts($response);
		// The opening bracket, one part per new entry and the closing bracket
		$this->assertCount(4, $parts);
		$this->assertSame(['4', '3'], array_column(json_decode(implode('', $parts), true), 'reqId'));
	}

	public function testPollHandlesEntriesWithoutReqIdWithoutWarnings(): void {
		$this->mockLogWithEntries(implode("\n", [
			'{"reqId":"1","level":3,"time":"2019-11-04T18:50:57+00:00","app":"files","message":"Entry 1"}',
			'{"level":3,"time":"2019-11-04T18:50:58+00:00","app":"files","message":"No request id"}',
			'{"level":3,"time":"2019-11-04T18:50:59+00:00","app":"files","message":"No request id either"}',
		]));

		set_error_handler(static function (int $level, string $message): never {
			throw new \ErrorException($message, 0, $level);
		});
		try {
			$data = $this->getResponseData($this->logController->poll('1'));
		} finally {
			restore_error_handler();
		}

		$this->assertSame(['No request id either', 'No request id'], array_column($data, 'message'));
	}

	public function testPollReadsAtMostOneHundredThousandEntries(): void {
		$this->mockLogWithEntries($this->getLogWithEntries(100001));

		$data = $this->getResponseData($this->logController->poll('unknown'));

		$this->assertCount(100000, $data);
		$this->assertSame('100001', $data[0]['reqId']);
		$this->assertSame('2', $data[99999]['reqId']);
	}

	public static function pollProvider(): array {
		return [
			'new entries' => ['lastReqId' => '1', 'expectedReqIds' => ['3', '2']],
			'no new entry' => ['lastReqId' => '3', 'expectedReqIds' => []],
		];
	}

	#[DataProvider(methodName: 'pollProvider')]
	public function testPollOpensTheLogOnce(string $lastReqId, array $expectedReqIds): void {
		$log = $this->getLogWithEntries(3);
		$opened = 0;
		$this->logIteratorFactory->method('getLogIterator')
			->willReturnCallback(function () use ($log, &$opened) {
				$opened++;
				// Like the factory's filter, this needs a rewind before the first entry can be read
				return new \CallbackFilterIterator($this->getLogIterator($log), fn () => true);
			});

		$data = $this->getResponseData($this->logController->poll($lastReqId));

		$this->assertSame($expectedReqIds, array_column($data, 'reqId'));
		$this->assertSame(1, $opened);
	}

	public function testSearchReadsThroughTheLogOnce(): void {
		$iterator = new class($this->getLogIterator($this->getLogWithEntries(20))) extends \IteratorIterator {
			public int $steps = 0;

			#[\Override]
			public function next(): void {
				$this->steps++;
				parent::next();
			}
		};
		$this->logIteratorFactory->method('getLogIterator')
			->willReturn($iterator);

		$data = $this->getResponseData($this->logController->get('no entry contains this'));

		$this->assertSame(['data' => [], 'remain' => false], $data);
		$this->assertSame(20, $iterator->steps);
	}

	public function testGetStopsSkippingToTheOffsetAtTheEndOfTheLog(): void {
		$iterator = new class($this->getLogIterator($this->getLogWithEntries(20))) extends \IteratorIterator {
			public int $steps = 0;

			#[\Override]
			public function next(): void {
				$this->steps++;
				parent::next();
			}
		};
		$this->logIteratorFactory->method('getLogIterator')
			->willReturn($iterator);

		$data = $this->getResponseData($this->logController->get('', 50, 1000));

		$this->assertSame(['data' => [], 'remain' => false], $data);
		$this->assertSame(20, $iterator->steps);
	}

	public function testSearchReadsThroughTheLogOnceWhenNoEntryHasAShownLevel(): void {
		$iterator = new class($this->getLogIterator($this->getLogWithEntries(20))) extends \IteratorIterator {
			public int $steps = 0;

			#[\Override]
			public function next(): void {
				$this->steps++;
				parent::next();
			}
		};
		// Like the factory's level filter, here with none of the entries' levels shown
		$this->logIteratorFactory->method('getLogIterator')
			->willReturn(new \CallbackFilterIterator($iterator, fn () => false));

		$data = $this->getResponseData($this->logController->get('Entry'));

		$this->assertSame(['data' => [], 'remain' => false], $data);
		$this->assertSame(20, $iterator->steps);
	}
}
