<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\LogReader\Tests\Unit\Service;

use OCA\LogReader\Constants;
use OCA\LogReader\Service\SettingsService;
use OCP\IAppConfig;
use OCP\IConfig;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\MockObject\MockObject;
use Test\TestCase;

class SettingsServiceTest extends TestCase {

	/** @var SettingsService */
	private $settingsService;

	/** @var IConfig|MockObject */
	private $config;

	/** @var IAppConfig|MockObject */
	private $appConfig;

	public function setUp(): void {
		parent::setUp();

		$this->config = $this->createMock(IConfig::class);
		$this->appConfig = $this->createMock(IAppConfig::class);
		$this->settingsService = new SettingsService($this->config, $this->appConfig);
	}

	public static function dataTestGetters(): array {
		return [
			'shown_levels' => ['getShownLevels', 'getValueArray', Constants::CONFIG_KEY_SHOWNLEVELS, [3, 4]],
			'datetime_format' => ['getDateTimeFormat', 'getValueString', Constants::CONFIG_KEY_DATETIMEFORMAT, '"utc"', 'utc'],
			'live_log' => ['getLiveLog', 'getValueBool', Constants::CONFIG_KEY_LIVELOG, false],
			'relative_dates' => ['getRelativeDates', 'getValueBool', Constants::CONFIG_KEY_RELATIVEDATES, true],
		];
	}

	#[DataProvider(methodName: 'dataTestGetters')]
	public function testGetters(string $fn, string $method, string $configKey, mixed $configValue, mixed $expected = null) {
		$this->appConfig->expects($this->once())
			->method($method)
			->with('logreader', $configKey)
			->willReturn($configValue);

		$this->assertEquals($expected ?? $configValue, $this->settingsService->{$fn}());
	}

	public static function dataTestGettersDefault(): array {
		return [
			'shown_levels' => ['getShownLevels', 'getValueArray', Constants::LOGGING_LEVELS],
			'datetime_format' => ['getDateTimeFormat', 'getValueString', 'local'],
			'live_log' => ['getLiveLog', 'getValueBool', true],
			'relative_dates' => ['getRelativeDates', 'getValueBool', false],
		];
	}

	#[DataProvider(methodName: 'dataTestGettersDefault')]
	public function testGettersDefault(string $fn, string $method, mixed $expected) {
		$this->appConfig->expects($this->once())
			->method($method)
			->willReturnCallback(fn ($app, $key, $default = false) => $default);

		$this->assertEquals($expected, $this->settingsService->{$fn}());
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
		$this->mockAppConfigDefaults();

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
		$this->mockAppConfigDefaults();

		$this->assertEquals($this->settingsService->getAppSettings(), [
			Constants::CONFIG_KEY_SHOWNLEVELS => Constants::LOGGING_LEVELS,
			Constants::CONFIG_KEY_LOGLEVEL => 2,
			Constants::CONFIG_KEY_DATETIMEFORMAT => 'local',
			Constants::CONFIG_KEY_RELATIVEDATES => false,
			Constants::CONFIG_KEY_LIVELOG => true,
			'enabled' => false,
		]);
	}

	private function mockAppConfigDefaults(): void {
		foreach (['getValueString', 'getValueBool', 'getValueArray'] as $method) {
			$this->appConfig->method($method)
				->willReturnCallback(fn ($app, $key, $default = false) => $default);
		}
	}
}
