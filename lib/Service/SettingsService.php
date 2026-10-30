<?php

/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\LogReader\Service;

use OCA\LogReader\Constants;
use OCP\IAppConfig;
use OCP\IConfig;

/**
 * @psalm-api
 */
class SettingsService {
	public function __construct(
		private readonly IConfig $config,
		private readonly IAppConfig $appConfig,
	) {
	}

	/**
	 * Load shown levels from app config
	 */
	public function getShownLevels(): array {
		return $this->appConfig->getValueArray('logreader', Constants::CONFIG_KEY_SHOWNLEVELS);
	}

	/**
	 * Load date time format to use for user from app config
	 */
	public function getDateTimeFormat(): string {
		return $this->appConfig->getValueString('logreader', Constants::CONFIG_KEY_DATETIMEFORMAT);
	}

	/**
	 * Load app config if dates should be displayed as relative dates
	 */
	public function getRelativeDates(): bool {
		return $this->appConfig->getValueBool('logreader', Constants::CONFIG_KEY_RELATIVEDATES);
	}

	/**
	 * Load app config if log should be updated automatically
	 */
	public function getLiveLog(): bool {
		return $this->appConfig->getValueBool('logreader', Constants::CONFIG_KEY_LIVELOG);
	}

	/**
	 * Get all app settings for displaying the logfiles
	 */
	public function getAppSettings(): array {
		return [
			Constants::CONFIG_KEY_SHOWNLEVELS => $this->getShownLevels(),
			Constants::CONFIG_KEY_LOGLEVEL => $this->config->getSystemValueInt('loglevel', 2),
			Constants::CONFIG_KEY_DATETIMEFORMAT => $this->getDateTimeFormat(),
			Constants::CONFIG_KEY_RELATIVEDATES => $this->getRelativeDates(),
			Constants::CONFIG_KEY_LIVELOG => $this->getLiveLog(),
			'enabled' => $this->getLoggingType() === 'file',
		];
	}

	/**
	 * Get system setting of the logging type
	 */
	public function getLoggingType(): string {
		return $this->config->getSystemValueString('log_type', 'file');
	}

	/**
	 * Get system setting of the log file name
	 */
	public function getLoggingFile(): string {
		return $this->config->getSystemValueString('logile', '');
	}

	/**
	 * Get system setting for the log date format
	 */
	public function getLoggingDateFormat(): string {
		// see default: https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/logging_configuration.html#file
		return $this->config->getSystemValueString('logdateformat', 'c');
	}

	/**
	 * Get system setting for the log timezone
	 */
	public function getLoggingTimezone(): string {
		return $this->config->getSystemValueString('logtimezone', 'UTC');
	}
}
