<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\LogReader\Tests\Unit\Service;

use OCA\LogReader\Constants;
use OCA\LogReader\Service\SettingsService;
use OCP\IConfig;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class SettingsServiceTest extends TestCase {

	/** @var SettingsService */
	private $settingsService;

	/** @var IConfig|MockObject */
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
		$this->config->expects($this->once())
			->method('getSystemValueString')
			->with($this->equalTo('log_type'), $this->anything())
			->willReturn('file');
		$this->config->expects($this->once())
			->method('getSystemValueInt')
			->with($this->equalTo('loglevel'), 2)
			->willReturn(4);
		$this->config->expects($this->any())
			->method('getAppValue')
			->willReturnCallback(function ($app, $key, $fallback) {
				return $fallback;
			});

		$this->assertEquals($this->settingsService->getAppSettings(), [
			Constants::CONFIG_KEY_SHOWNLEVELS => Constants::LOGGING_LEVELS,
			Constants::CONFIG_KEY_LOGLEVEL => 4,
			Constants::CONFIG_KEY_DATETIMEFORMAT => 'local',
			Constants::CONFIG_KEY_RELATIVEDATES => false,
			Constants::CONFIG_KEY_LIVELOG => true,
			'enabled' => true,
		]);
	}

	public function testGetAppSettings_nonfile() {
		$this->config->expects($this->once())
			->method('getSystemValueString')
			->with($this->equalTo('log_type'), $this->anything())
			->willReturn('syslog');
		$this->config->expects($this->once())
			->method('getSystemValueInt')
			->with($this->equalTo('loglevel'), 2)
			->willReturn(2);
		$this->config->expects($this->any())
			->method('getAppValue')
			->willReturnCallback(function ($app, $key, $fallback) {
				return $fallback;
			});

		$this->assertEquals($this->settingsService->getAppSettings(), [
			Constants::CONFIG_KEY_SHOWNLEVELS => Constants::LOGGING_LEVELS,
			Constants::CONFIG_KEY_LOGLEVEL => 2,
			Constants::CONFIG_KEY_DATETIMEFORMAT => 'local',
			Constants::CONFIG_KEY_RELATIVEDATES => false,
			Constants::CONFIG_KEY_LIVELOG => true,
			'enabled' => false,
		]);
	}
}
