<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * @author Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * @license AGPL-3.0-or-later
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
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
namespace OCA\LogReader\Tests\Unit\Service;

use OCA\LogReader\Constants;
use OCA\LogReader\Service\SettingsService;
use OCP\IConfig;

use Test\TestCase;

class SettingsServiceTest extends TestCase {

	/** @var SettingsService */
	private $settingsService;

	/** @var IConfig */
	private $config;

	public function setUp(): void {
		parent::setUp();

		$this->config = $this->createMock(IConfig::class);
		$this->settingsService = new SettingsService($this->config);
	}

	public function dataTestGetters() {
		return [
			'shown_levels' => [
				'fn' => 'getShownLevels',
				'default' => false,
				'configKey' => Constants::CONFIG_KEY_SHOWNLEVELS,
				'configValue' => '[3,4]',
				'expected' => [3, 4],
			],
			'shown_levels_unset' => [
				'fn' => 'getShownLevels',
				'default' => true,
				'configKey' => Constants::CONFIG_KEY_SHOWNLEVELS,
				'configValue' => null,
				'expected' => Constants::LOGGING_LEVELS,
			],
			'datetime_format' => [
				'fn' => 'getDateTimeFormat',
				'default' => false,
				'configKey' => Constants::CONFIG_KEY_DATETIMEFORMAT,
				'configValue' => '"utc"',
				'expected' => 'utc',
			],
			'datetime_format_unset' => [
				'fn' => 'getDateTimeFormat',
				'default' => true,
				'configKey' => Constants::CONFIG_KEY_DATETIMEFORMAT,
				'configValue' => null,
				'expected' => 'local',
			],
			'live_log' => [
				'fn' => 'getLiveLog',
				'default' => false,
				'configKey' => Constants::CONFIG_KEY_LIVELOG,
				'configValue' => 'false',
				'expected' => false,
			],
			'live_log_unset' => [
				'fn' => 'getLiveLog',
				'default' => true,
				'configKey' => Constants::CONFIG_KEY_LIVELOG,
				'configValue' => null,
				'expected' => true,
			],
			'relative_dates' => [
				'fn' => 'getRelativeDates',
				'default' => false,
				'configKey' => Constants::CONFIG_KEY_RELATIVEDATES,
				'configValue' => 'true',
				'expected' => true,
			],
			'relative_dates_unset' => [
				'fn' => 'getRelativeDates',
				'default' => true,
				'configKey' => Constants::CONFIG_KEY_RELATIVEDATES,
				'configValue' => null,
				'expected' => false,
			],
		];
	}

	/**
	 * @dataProvider dataTestGetters
	 */
	public function testGetters(string $fn, bool $default, string $configKey, ?string $configValue, mixed $expected) {
		$this->config->expects($this->once())
			->method('getAppValue')
			->with($this->equalTo('logreader'), $this->equalTo($configKey), $this->anything())
			->willReturnCallback(function ($app, $key, $fallback) use ($default, $configValue) {
				return $default ? $fallback : $configValue;
			});

		$this->assertEquals($this->settingsService->{$fn}(), $expected);
	}

	public function testGetLoggingType() {
		$this->config->expects($this->once())
			->method('getSystemValueString')
			->with($this->equalTo('log_type'), $this->anything())
			->willReturn('syslog');

		$this->assertEquals($this->settingsService->getLoggingType(), 'syslog');
	}

	public function testGetAppSettings() {
		$this->config->expects($this->any())
			->method('getAppValue')
			->willReturnCallback(function ($app, $key, $fallback) {
				return $fallback;
			});

		$this->assertEquals($this->settingsService->getAppSettings(), [
			Constants::CONFIG_KEY_SHOWNLEVELS => Constants::LOGGING_LEVELS,
			Constants::CONFIG_KEY_DATETIMEFORMAT => 'local',
			Constants::CONFIG_KEY_RELATIVEDATES => false,
			Constants::CONFIG_KEY_LIVELOG => true,
		]);
	}

	public function testGetAppSettings_nonfile() {
		$this->config->expects($this->any())
			->method('getAppValue')
			->willReturnCallback(function ($app, $key, $fallback) {
				return $fallback;
			});

		$this->assertEquals($this->settingsService->getAppSettings(), [
			Constants::CONFIG_KEY_SHOWNLEVELS => Constants::LOGGING_LEVELS,
			Constants::CONFIG_KEY_DATETIMEFORMAT => 'local',
			Constants::CONFIG_KEY_RELATIVEDATES => false,
			Constants::CONFIG_KEY_LIVELOG => true,
		]);
	}
}
