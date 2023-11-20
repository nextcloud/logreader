<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2018 Robin Appelman <robin@icewind.nl>
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

use OCP\Files\IAppData;
use OCP\Files\NotFoundException;
use OCP\IConfig;
use OCP\Log\IFileBased;
use OCP\Log\ILogFactory;

class LogIteratorFactory {

	public function __construct(
		private IConfig $config,
		private ILogFactory $logFactory,
		private IAppData $appData,
	) {
	}

	/**
	 * @return \Iterator
	 * @param int[] $levels Array of levels to show
	 * @throws \Exception
	 */
	public function getLogIterator(array $levels) {
		$dateFormat = $this->config->getSystemValue('logdateformat', \DateTime::ATOM);
		$timezone = $this->config->getSystemValue('logtimezone', 'UTC');

		if ($this->config->getSystemValue('log_type', 'file') !== 'file') {
			try {
				$folder = $this->appData->getFolder('logreader');
			} catch (NotFoundException $e) {
				$folder = $this->appData->newFolder('logreader');
			}

			try {
				$logfile = $folder->getFile('nextcloud.log');
			} catch (NotFoundException $e) {
				$logfile = $folder->newFile('nextcloud.log');
			}

			$handle = $logfile->read();
			if (!$handle) {
				throw new \Exception('Error while opening internal logfile');
			}
		} else {
			$logfile = $this->logFactory->get('file');
			if ($logfile instanceof IFileBased) {
				$handle = fopen($logfile->getLogFilePath(), 'rb');
				if (!$handle) {
					throw new \Exception("Error while opening " . $logfile->getLogFilePath());
				}
			} else {
				throw new \Exception('Can\'t find log class');
			}
		}

		$iterator = new LogIterator($handle, $dateFormat, $timezone);
		return new \CallbackFilterIterator($iterator, function ($logItem) use ($levels) {
			return $logItem && in_array($logItem['level'], $levels);
		});
	}
}
