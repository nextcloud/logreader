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
use OCP\IRequest;
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

	public function testPollIncludesTheNewestLogEntry(): void {
		$log = '{"reqId":"1","level":3,"time":"2019-11-04T18:50:57+00:00","app":"comments"}' . "\n"
			. '{"reqId":"2","level":3,"time":"2019-11-04T18:50:58+00:00","app":"gallery"}' . "\n"
			. '{"reqId":"3","level":3,"time":"2019-11-04T18:50:59+00:00","app":"files"}';
		$this->mockLogWithEntries($log);

		$response = $this->logController->poll('1');
		$data = $response->getData();

		$this->assertCount(2, $data);
		// sorted newest first, the last written entry (reqId 3) must be included
		$this->assertEquals('3', $data[0]['reqId']);
		$this->assertEquals('2', $data[1]['reqId']);
	}

	public function testPollReturnsEmptyWhenThereIsNoNewEntry(): void {
		$log = '{"reqId":"1","level":3,"time":"2019-11-04T18:50:57+00:00","app":"comments"}';
		$this->mockLogWithEntries($log);

		$response = $this->logController->poll('1');

		$this->assertEquals([], $response->getData());
	}
}
