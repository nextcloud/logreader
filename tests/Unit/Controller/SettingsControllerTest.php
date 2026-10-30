<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\LogReader\Tests\Unit\Controler;

use OCA\LogReader\Constants;
use OCA\LogReader\Controller\SettingsController;
use OCA\LogReader\Service\SettingsService;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\JSONResponse;
use OCP\IAppConfig;
use OCP\IConfig;
use OCP\IRequest;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\MockObject\MockObject;
use Psr\Log\LoggerInterface;
use Test\TestCase;

class SettingsControllerTest extends TestCase {

	/** @var SettingsController */
	private $settingsController;

	/** @var SettingsService|MockObject */
	private $settingsService;

	/** @var IConfig|MockObject */
	private $config;

	/** @var LoggerInterface|MockObject */
	private $logger;

	/** @var IRequest|MockObject */
	private $request;

	/** @var IAppConfig|MockObject */
	private $appConfig;

	public function setUp(): void {
		parent::setUp();

		$this->settingsService = $this->createMock(SettingsService::class);
		$this->config = $this->createMock(IConfig::class);
		/** @var LoggerInterface */
		$this->logger = $this->getMockBuilder(\Psr\Log\LoggerInterface::class)->getMock();
		$this->request = $this->createMock(IRequest::class);
		$this->appConfig = $this->createMock(IAppConfig::class);

		$this->settingsController = new SettingsController(
			'logreader',
			$this->request,
			$this->settingsService,
			$this->config,
			$this->logger,
			$this->appConfig,
		);
	}

	public function testGetAppConfig() {
		$this->settingsService->expects($this->once())
			->method('getAppSettings')
			->willReturn([
				Constants::CONFIG_KEY_SHOWNLEVELS => Constants::LOGGING_LEVELS,
				Constants::CONFIG_KEY_LOGLEVEL => 4,
				Constants::CONFIG_KEY_DATETIMEFORMAT => 'local',
				Constants::CONFIG_KEY_RELATIVEDATES => false,
				Constants::CONFIG_KEY_LIVELOG => true,
				'enabled' => true,
			]);

		$this->assertEquals(new JSONResponse([
			Constants::CONFIG_KEY_SHOWNLEVELS => Constants::LOGGING_LEVELS,
			Constants::CONFIG_KEY_LOGLEVEL => 4,
			Constants::CONFIG_KEY_DATETIMEFORMAT => 'local',
			Constants::CONFIG_KEY_RELATIVEDATES => false,
			Constants::CONFIG_KEY_LIVELOG => true,
			'enabled' => true,
		]), $this->settingsController->getAppConfig());
	}

	public static function dataUpdateAppConfig(): array {
		return [
			'booleanConfig' => [
				'configKey' => Constants::CONFIG_KEY_LIVELOG,
				'configValue' => true,
				'method' => 'setValueBool',
				'storedValue' => true,
			],
			'arrayConfig' => [
				'configKey' => Constants::CONFIG_KEY_SHOWNLEVELS,
				'configValue' => [3, 4],
				'method' => 'setValueArray',
				'storedValue' => [3, 4],
			],
			'stringConfig' => [
				'configKey' => Constants::CONFIG_KEY_DATETIMEFORMAT,
				'configValue' => 'utc',
				'method' => 'setValueString',
				'storedValue' => '"utc"',
			],
		];
	}

	#[DataProvider(methodName: 'dataUpdateAppConfig')]
	public function testUpdateAppConfig(string $configKey, $configValue, string $method, $storedValue) {
		$this->logger->expects($this->once())
			->method('debug');

		$this->appConfig->expects($this->once())
			->method($method)
			->with('logreader', $configKey, $storedValue);

		$this->settingsService->expects($this->once())
			->method('getAppSettings')
			->willReturn([
				Constants::CONFIG_KEY_SHOWNLEVELS => Constants::LOGGING_LEVELS,
				Constants::CONFIG_KEY_LOGLEVEL => 3,
				Constants::CONFIG_KEY_DATETIMEFORMAT => 'local',
				Constants::CONFIG_KEY_RELATIVEDATES => false,
				Constants::CONFIG_KEY_LIVELOG => true,
				'enabled' => true,
			]);

		$this->assertEquals(new JSONResponse(), $this->settingsController->updateAppConfig($configKey, $configValue));
	}

	public function testUpdateAppConfig_logLevel() {
		$this->logger->expects($this->once())
			->method('debug');

		$this->config->expects($this->once())
			->method('setSystemValue')
			->with('loglevel', 4);

		$this->settingsService->expects($this->once())
			->method('getAppSettings')
			->willReturn([
				Constants::CONFIG_KEY_SHOWNLEVELS => Constants::LOGGING_LEVELS,
				Constants::CONFIG_KEY_LOGLEVEL => 3,
				Constants::CONFIG_KEY_DATETIMEFORMAT => 'local',
				Constants::CONFIG_KEY_RELATIVEDATES => false,
				Constants::CONFIG_KEY_LIVELOG => true,
				'enabled' => true,
			]);

		$this->assertEquals(new JSONResponse(), $this->settingsController->updateAppConfig(Constants::CONFIG_KEY_LOGLEVEL, 4));
	}

	public function testUpdateAppConfig_unknownKey() {
		$this->logger->expects($this->any())
			->method('debug');

		$this->appConfig->expects($this->never())
			->method($this->anything());

		$this->assertEquals(new JSONResponse([], Http::STATUS_BAD_REQUEST), $this->settingsController->updateAppConfig('someUnknownKey', 'storeThisValue!'));
	}

	public function testUpdateAppConfig_invalidType() {
		$this->logger->expects($this->any())
			->method('debug');
		$this->appConfig->expects($this->never())
			->method($this->anything());
		$this->settingsService->expects($this->once())
			->method('getAppSettings')
			->willReturn([
				Constants::CONFIG_KEY_SHOWNLEVELS => Constants::LOGGING_LEVELS,
				Constants::CONFIG_KEY_DATETIMEFORMAT => 'local',
				Constants::CONFIG_KEY_RELATIVEDATES => false,
				Constants::CONFIG_KEY_LIVELOG => true,
				'enabled' => true,
			]);
		$this->assertEquals(new JSONResponse([], Http::STATUS_BAD_REQUEST), $this->settingsController->updateAppConfig(Constants::CONFIG_KEY_SHOWNLEVELS, 'debug'));
	}

	public function testUpdateAppConfig_invalidLevel() {
		$this->logger->expects($this->any())
			->method('debug');

		$this->appConfig->expects($this->never())
			->method($this->anything());
		$this->settingsService->expects($this->once())
			->method('getAppSettings')
			->willReturn([
				Constants::CONFIG_KEY_SHOWNLEVELS => Constants::LOGGING_LEVELS,
				Constants::CONFIG_KEY_DATETIMEFORMAT => 'local',
				Constants::CONFIG_KEY_RELATIVEDATES => false,
				Constants::CONFIG_KEY_LIVELOG => true,
				'enabled' => true,
			]);

		$this->assertEquals(new JSONResponse([], Http::STATUS_BAD_REQUEST), $this->settingsController->updateAppConfig(Constants::CONFIG_KEY_SHOWNLEVELS, ['debug']));
	}
}
