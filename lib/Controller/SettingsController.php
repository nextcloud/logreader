<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\LogReader\Controller;

use OCA\LogReader\Constants;
use OCA\LogReader\Service\SettingsService;
use OCA\LogReader\Settings\Admin;
use OCP\AppFramework\ApiController;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\AuthorizedAdminSetting;
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
	 */
	#[AuthorizedAdminSetting(settings: Admin::class)]
	public function getAppConfig(): JSONResponse {
		return new JSONResponse($this->settingsService->getAppSettings());
	}

	/**
	 * Update values on the app config.
	 *
	 * @param string $settingsKey AppConfig Key to store
	 * @param mixed $settingsValues Corresponding AppConfig Value
	 *
	 */
	#[AuthorizedAdminSetting(settings: Admin::class)]
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
			$this->logger->debug('Incorrect value type for appConfig key', ['settingsKey' => $settingsKey, 'valueType' => gettype($settingsValue)]);
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

		if ($settingsKey === Constants::CONFIG_KEY_LOGLEVEL) {
			// Validate loglevel value
			if (!is_int($settingsValue) || $settingsValue < 0 || $settingsValue > 4) {
				$this->logger->debug('Cannot set {settingsValue} as loglevel', ['settingsValue' => $settingsValue ]);
				return new JSONResponse([], Http::STATUS_BAD_REQUEST);
			}
			// Set backend loglevel directly via system value
			$this->config->setSystemValue('loglevel', $settingsValue);
		} else {
			// Set on DB
			$this->config->setAppValue($this->appName, $settingsKey, json_encode($settingsValue));
		}

		return new JSONResponse();
	}
}
