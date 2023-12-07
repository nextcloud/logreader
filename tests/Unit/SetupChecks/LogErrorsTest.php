<?php

declare(strict_types=1);

/**
 * @copyright Copyright (c) 2023 Côme Chilliet <come.chilliet@nextcloud.com>
 *
 * @author Côme Chilliet <come.chilliet@nextcloud.com>
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

namespace OCA\LogReader\Tests\Unit\SetupChecks;

use OCA\LogReader\Log\LogIteratorFactory;
use OCA\LogReader\SetupChecks\LogErrors;
use OCP\IConfig;
use OCP\IDateTimeFormatter;
use OCP\IL10N;
use Test\TestCase;

class LogErrorsTest extends TestCase {
	private IL10N $l10n;
	private IConfig $config;
	private IDateTimeFormatter $dateFormatter;
	private LogIteratorFactory $logIteratorFactory;
	private LogErrors $logErrorsCheck;

	protected function setUp(): void {
		parent::setUp();

		$this->l10n = $this->createMock(IL10N::class);
		$this->config = $this->createMock(IConfig::class);
		$this->dateFormatter = $this->createMock(IDateTimeFormatter::class);
		$this->logIteratorFactory = $this->createMock(LogIteratorFactory::class);
		$this->logErrorsCheck = new LogErrors(
			$this->l10n,
			$this->config,
			$this->dateFormatter,
			$this->logIteratorFactory,
		);
	}

	public function logProvider(): array {
		$now = (new \DateTime())->format(\DateTime::ATOM);
		$tooOld = (new \DateTime('1 month ago'))->format(\DateTime::ATOM);
		return [
			[[], 'success'],
			[[['level' => 2, 'time' => $now]], 'info'],
			[[['level' => 3, 'time' => $now]], 'warning'],
			[[['level' => 2, 'time' => $now],['level' => 3, 'time' => $now]], 'warning'],
			[[['level' => 2, 'time' => $now],['level' => 3, 'time' => $tooOld]], 'info'],
			[[['level' => 2, 'time' => $tooOld],['level' => 3, 'time' => $tooOld]], 'success'],
		];
	}

	/**
	 * @dataProvider logProvider
	 */
	public function testSetupCheck(array $logContent, string $severity): void {
		$logIterator = new \ArrayIterator($logContent);
		$this->logIteratorFactory
			->expects(self::once())
			->method('getLogIterator')
			->willReturn($logIterator);

		$result = $this->logErrorsCheck->run();

		$this->assertEquals($severity, $result->getSeverity());
	}
}
