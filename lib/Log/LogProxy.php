<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2023 Ferdinand Thiessen <opensource@fthiessen.de>
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

namespace OCA\LogReader\Log;

use OC\Log\LogDetails;
use OC\SystemConfig;
use OCP\Files\IAppData;
use OCP\Files\NotFoundException;
use OCP\Files\SimpleFS\ISimpleFile;

/**
 * Create a logfile even for syslog etc loggers
 */
class LogProxy extends LogDetails {
	private ISimpleFile $logfile;

	public function __construct(IAppData $appData, private SystemConfig $config) {
		parent::__construct($config);

		try {
			$folder = $appData->getFolder('logreader');
		} catch (NotFoundException $e) {
			$folder = $appData->newFolder('logreader');
		}

		try {
			$this->logfile = $folder->getFile('nextcloud.log');
		} catch (NotFoundException $e) {
			$this->logfile = $folder->newFile('nextcloud.log');
		}
	}

	public function log(int $level, string $app, array $entry) {
		if ($level >= $this->config->getValue('loglevel', 1)) {
			$hasBacktrace = isset($entry['exception']);
			$logBacktrace = $this->config->getValue('log.backtrace', false);
			if (!$hasBacktrace && $logBacktrace) {
				$entry['backtrace'] = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS);
			}

			$entry = $this->logDetailsAsJSON($app, $entry, $level);

			$handle = $this->logfile->read();
			if ($handle) {
				$content = stream_get_contents($handle);
				fclose($handle);
			}

			$handle = $this->logfile->write();
			if ($handle) {
				if (isset($content) && $content !== false) {
					fwrite($handle, $content);
				}
				fwrite($handle, $entry."\n");
				fclose($handle);
			} else {
				throw new \Error('Could not open internal log file.');
			}
		}
	}
}
