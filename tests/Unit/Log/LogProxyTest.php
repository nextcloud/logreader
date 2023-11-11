<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

namespace OCA\LogReader\Log;

use OC\SystemConfig;
use OCP\Files\IAppData;
use OCP\Files\NotFoundException;
use OCP\Files\SimpleFS\ISimpleFile;
use OCP\Files\SimpleFS\ISimpleFolder;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class LogIteratorTest extends TestCase {

	private SystemConfig|MockObject $config;
	private IAppData|MockObject $appData;

	public function setUp(): void {
		parent::setUp();

		$this->config = $this->createMock(SystemConfig::class);
		$this->appData = $this->createMock(IAppData::class);
	}

	/**
	 * Test that initializing the proxy works if there is no internal log file available
	 * A new log file should be created
	 */
	public function testNewFileIsCreated() {
		// no folder so it will throw
		$this->appData->expects($this->once())->method('getFolder')->willThrowException(new NotFoundException());
		// new created file
		$file = $this->createMock(ISimpleFile::class);
		/**
		 * A new folder shall be created
		 * @var MockObject
		 */
		$folder = $this->createMock(ISimpleFolder::class);
		$folder->expects($this->once())->method('getFile')->willThrowException(new NotFoundException());
		$folder->expects($this->once())->method('newFile')->willReturn($file);
		$this->appData->expects($this->once())->method('newFolder')->willReturn($folder);

		new LogProxy($this->appData, $this->config);
	}

	/**
	 * Test that initializing the proxy works if the internal log file is already present
	 */
	public function testInitWithExistingFile() {
		$file = $this->createMock(ISimpleFile::class);
		$this->initWithFile($file);
	}

	/**
	 * Test that log entries with too low log level are skipped
	 * Only log entries that are equal or above the configured treshold
	 */
	public function testLogLevelTooLow() {
		$file = $this->createMock(ISimpleFile::class);
		$file->expects($this->never())->method('read');
		$proxy = $this->initWithFile($file);

		$this->config->expects($this->once())->method('getValue')->willReturnCallback(fn ($key, $default) => match($key) {
			'loglevel' => 2,
			default => throw new \Error(),
		});

		$proxy->log(0, 'debug should not log', []);
	}

	/**
	 * Test that an exception is thrown if the write to the internal log file fails
	 */
	public function testWriteFailed() {
		$file = $this->createMock(ISimpleFile::class);
		$file->expects($this->once())->method('read')->willReturn($this->mockHandle(''));
		$file->expects($this->once())->method('write')->willReturn(false);

		$this->config->expects($this->any())->method('getValue')->willReturnCallback(fn ($key, $default) => $default);

		$this->expectException(\Error::class);

		$proxy = $this->initWithFile($file);
		$proxy->log(2, 'my-app', ['message' => 'foo']);
	}

	/**
	 * Test that logging works if the internal log file does not exist previously or is empty
	 */
	public function testLogWithoutOldFile() {
		$outputFile = tempnam(sys_get_temp_dir(), 'testoutput');
		$output = fopen($outputFile, 'w');

		$file = $this->createMock(ISimpleFile::class);
		$file->expects($this->once())->method('read')->willReturn($this->mockHandle(''));
		$file->expects($this->once())->method('write')->willReturn($output);

		$this->config->expects($this->any())->method('getValue')->willReturnCallback(fn ($key, $default) => $default);

		$proxy = $this->initWithFile($file);
		$proxy->log(2, 'my-app', ['message' => 'foo']);

		$this->assertMatchesRegularExpression('/^{.+"app":"my-app".+"message":"foo".+}$/', file_get_contents($outputFile));
		unlink($outputFile);
	}

	/**
	 * Test that old entries in the internal log file are preserved
	 */
	public function testLogWithOldFile() {
		$outputFile = tempnam(sys_get_temp_dir(), 'testoutput');
		$output = fopen($outputFile, 'w');

		$file = $this->createMock(ISimpleFile::class);
		$file->expects($this->once())->method('read')->willReturn($this->mockHandle("{\"message\":\"old entry\"}\n"));
		$file->expects($this->once())->method('write')->willReturn($output);

		$this->config->expects($this->any())->method('getValue')->willReturnCallback(fn ($key, $default) => $default);

		$proxy = $this->initWithFile($file);
		$proxy->log(2, 'my-app', ['message' => 'foo']);

		$this->assertMatchesRegularExpression('/^{"message":"old entry"}\n{.+"app":"my-app".+"message":"foo".+}/', file_get_contents($outputFile));
		unlink($outputFile);
	}

	/**
	 * Test that backtrace information are added just like with the default file logger
	 * (If configured)
	 */
	public function testBacktraceInformation() {
		$outputFile = tempnam(sys_get_temp_dir(), 'testoutput');
		$output = fopen($outputFile, 'w');

		$file = $this->createMock(ISimpleFile::class);
		$file->expects($this->once())->method('read')->willReturn($this->mockHandle(''));
		$file->expects($this->once())->method('write')->willReturn($output);

		$this->config->expects($this->any())->method('getValue')->willReturnCallback(fn ($key, $default) => match($key) {
			'log.backtrace' => true,
			default => $default,
		});

		$proxy = $this->initWithFile($file);
		$proxy->log(2, 'my-app', ['message' => 'foo']);

		$this->assertMatchesRegularExpression('/^{.+"app":"my-app".+"message":"foo".+"backtrace":\[.+}$/', file_get_contents($outputFile));
		unlink($outputFile);
	}

	private function initWithFile(MockObject $file) {
		$folder = $this->createMock(ISimpleFolder::class);
		$folder->expects($this->once())->method('getFile')->willReturn($file);
		$this->appData->expects($this->once())->method('getFolder')->willReturn($folder);

		// No new creation
		$this->appData->expects($this->never())->method('newFolder');
		$folder->expects($this->never())->method('newFile');

		return new LogProxy($this->appData, $this->config);
	}

	private function mockHandle(string $data) {
		$handle = fopen('php://temp', 'r+');
		fwrite($handle, $data);
		rewind($handle);
		return $handle;
	}
}
