<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2023 Nextcloud GmbH
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

namespace OCA\LogReader\Controller;

use OCA\LogReader\Constants;
use OCA\LogReader\Service\SettingsService;
use OCP\AppFramework\ApiController;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\JSONResponse;
use OCP\IConfig;
use OCP\IRequest;

use Psr\Log\LoggerInterface;

class SettingsController extends ApiController {

	public function __construct(
		string $appName,
		IRequest $request,
		private SettingsService $settingsService,
		private IConfig $config,
		private LoggerInterface $logger,
	) {
		parent::__construct($appName, $request);
	}

	/**
	 * Get the current app config
	 *
	 * @AuthorizedAdminSetting(settings=OCA\LogReader\Settings\Admin)
	 */
	public function getAppConfig(): JSONResponse {
		return new JSONResponse($this->settingsService->getAppSettings());
	}

	/**
	 * Update values on the app config.
	 *
	 * @param string $settingsKey AppConfig Key to store
	 * @param mixed $settingsValues Corresponding AppConfig Value
	 *
	 * @AuthorizedAdminSetting(settings=OCA\LogReader\Settings\Admin)
	 */
	public function updateAppConfig(string $settingsKey, $settingsValue): JSONResponse {
		$this->logger->debug('Updating AppConfig: {settingsKey} => {settingsValue}', [
			'settingsKey' => $settingsKey,
			'settingsValue' => $settingsValue
		]);

		// Check for allowed keys
		if (!in_array($settingsKey, Constants::CONFIG_KEYS)) {
			$this->logger->debug('Unknown appConfig key: ' . $settingsKey);
			return new JSONResponse([], Http::STATUS_BAD_REQUEST);
		}

		// Check type of value
		if (gettype($settingsValue) !== gettype($this->settingsService->getAppSettings()[$settingsKey])) {
			// Invalid type
			$this->logger->debug('Incorrect value type for appConfig key', ['settingsKey' => $settingsKey, "valueType" => gettype($settingsValue)]);
			return new JSONResponse([], Http::STATUS_BAD_REQUEST);
		}

		if ($settingsKey === Constants::CONFIG_KEY_SHOWNLEVELS) {
			foreach ($settingsValue as $value) {
				if (!is_integer($value) || !in_array($value, Constants::LOGGING_LEVELS)) {
					$this->logger->debug('Invalid logging level given', ['value' => $value ]);
					return new JSONResponse([], Http::STATUS_BAD_REQUEST);
				}
			}
		}

		// Set on DB
		$this->config->setAppValue($this->appName, $settingsKey, json_encode($settingsValue));

		return new JSONResponse();
	}
}
