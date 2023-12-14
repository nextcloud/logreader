<?php
/**
 * @author Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * @copyright Copyright (c) 2023, Nextcloud GmbH
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

namespace OCA\LogReader\Service;

use OCA\LogReader\Constants;
use OCP\IConfig;

class SettingsService {
	public function __construct(
		private IConfig $config,
	) {
		$this->config = $config;
	}

	/**
	 * Load shown levels from app config
	 */
	public function getShownLevels(): array {
		return json_decode($this->config->getAppValue('logreader', Constants::CONFIG_KEY_SHOWNLEVELS, '[0,1,2,3,4]'), flags: JSON_THROW_ON_ERROR);
	}

	/**
	 * Load date time format to use for user from app config
	 */
	public function getDateTimeFormat(): string {
		return json_decode($this->config->getAppValue('logreader', Constants::CONFIG_KEY_DATETIMEFORMAT, '"local"'), flags: JSON_THROW_ON_ERROR);
	}

	/**
	 * Load app config if dates should be displayed as relative dates
	 */
	public function getRelativeDates(): bool {
		return json_decode($this->config->getAppValue('logreader', Constants::CONFIG_KEY_RELATIVEDATES, 'false') ?: 'false', flags: JSON_THROW_ON_ERROR);
	}

	/**
	 * Load app config if log should be updated automatically
	 */
	public function getLiveLog(): bool {
		return json_decode($this->config->getAppValue('logreader', Constants::CONFIG_KEY_LIVELOG, 'true'), flags: JSON_THROW_ON_ERROR);
	}

	/**
	 * Get all app settings for displaying the logfiles
	 */
	public function getAppSettings(): array {
		return [
			Constants::CONFIG_KEY_SHOWNLEVELS => $this->getShownLevels(),
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
