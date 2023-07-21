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
namespace OCA\LogReader\Tests\Unit\Controler;

use OCA\LogReader\Constants;
use OCA\LogReader\Controller\SettingsController;
use OCA\LogReader\Service\SettingsService;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\JSONResponse;
use OCP\IConfig;
use OCP\IRequest;

use PHPUnit\Framework\MockObject\MockObject;
use Psr\Log\LoggerInterface;

use Test\TestCase;

class SettingsControllerTest extends TestCase {

	/** @var SettingsController */
	private $settingsController;

	/** @var SettingsService */
	private $settingsService;

	/** @var IConfig|MockObject */
	private $config;

	/** @var LoggerInterface|MockObject */
	private $logger;

	/** @var IRequest|MockObject */
	private $request;

	public function setUp(): void {
		parent::setUp();

		$this->settingsService = $this->createMock(SettingsService::class);
		$this->config = $this->createMock(IConfig::class);
		$this->logger = $this->getMockBuilder('Psr\Log\LoggerInterface')->getMock();
		$this->request = $this->createMock(IRequest::class);

		$this->settingsController = new SettingsController(
			'logreader',
			$this->request,
			$this->settingsService,
			$this->config,
			$this->logger,
		);
	}

	public function testGetAppConfig() {
		$this->settingsService->expects($this->once())
			->method('getAppSettings')
			->willReturn([
				Constants::CONFIG_KEY_SHOWNLEVELS => Constants::LOGGING_LEVELS,
				Constants::CONFIG_KEY_DATETIMEFORMAT => 'local',
				Constants::CONFIG_KEY_RELATIVEDATES => false,
				Constants::CONFIG_KEY_LIVELOG => true,
				'enabled' => true,
			]);
		
		$this->assertEquals(new JSONResponse([
			Constants::CONFIG_KEY_SHOWNLEVELS => Constants::LOGGING_LEVELS,
			Constants::CONFIG_KEY_DATETIMEFORMAT => 'local',
			Constants::CONFIG_KEY_RELATIVEDATES => false,
			Constants::CONFIG_KEY_LIVELOG => true,
			'enabled' => true,
		]), $this->settingsController->getAppConfig());
	}

	public function dataUpdateAppConfig() {
		return [
			'booleanConfig' => [
				'configKey' => Constants::CONFIG_KEY_LIVELOG,
				'configValue' => true,
				'strConfig' => 'true'
			],
			'arrayConfig' => [
				'configKey' => Constants::CONFIG_KEY_SHOWNLEVELS,
				'configValue' => [3, 4],
				'strConfig' => '[3,4]'
			]
		];
	}
	/**
	 * @dataProvider dataUpdateAppConfig
	 *
	 * @param string $configKey
	 * @param mixed $configValue
	 * @param string $strConfig The configValue as json-string
	 */
	public function testUpdateAppConfig(string $configKey, $configValue, string $strConfig) {
		$this->logger->expects($this->once())
			->method('debug');
		
		$this->config->expects($this->once())
			->method('setAppValue')
			->with('logreader', $configKey, $strConfig);

		$this->settingsService->expects($this->once())
			->method('getAppSettings')
			->willReturn([
				Constants::CONFIG_KEY_SHOWNLEVELS => Constants::LOGGING_LEVELS,
				Constants::CONFIG_KEY_DATETIMEFORMAT => 'local',
				Constants::CONFIG_KEY_RELATIVEDATES => false,
				Constants::CONFIG_KEY_LIVELOG => true,
				'enabled' => true,
			]);

		$this->assertEquals(new JSONResponse(), $this->settingsController->updateAppConfig($configKey, $configValue));
	}

	public function testUpdateAppConfig_unknownKey() {
		$this->logger->expects($this->any())
			->method('debug');
		
		$this->config->expects($this->never())
			->method('setAppValue');

		$this->assertEquals(new JSONResponse([], Http::STATUS_BAD_REQUEST), $this->settingsController->updateAppConfig('someUnknownKey', 'storeThisValue!'));
	}

	public function testUpdateAppConfig_invalidType() {
		$this->logger->expects($this->any())
			->method('debug');
		$this->config->expects($this->never())
			->method('setAppValue');
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
		
		$this->config->expects($this->never())
			->method('setAppValue');
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
