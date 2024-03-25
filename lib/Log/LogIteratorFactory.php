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

use OCP\IConfig;
use OCP\Log\IFileBased;
use OCP\Log\ILogFactory;

class LogIteratorFactory {
	public function __construct(
		private IConfig $config,
		private ILogFactory $logFactory,
	) {
	}

	/**
	 * @return \Iterator
	 * @param int[] $levels Array of levels to show
	 * @throws \Exception
	 */
	public function getLogIterator(array $levels): \Iterator {
		$dateFormat = $this->config->getSystemValue('logdateformat', \DateTime::ATOM);
		$timezone = $this->config->getSystemValue('logtimezone', 'UTC');
		$logType = $this->config->getSystemValue('log_type', 'file');
		if ($logType !== 'file') {
			throw new \Exception('Logreader application only supports "file" log_type');
		}
		$log = $this->logFactory->get('file');
		if ($log instanceof IFileBased) {
			$handle = fopen($log->getLogFilePath(), 'rb');
			if ($handle) {
				$iterator = new LogIterator($handle, $dateFormat, $timezone);
				return new \CallbackFilterIterator($iterator, function ($logItem) use ($levels) {
					return $logItem && in_array($logItem['level'], $levels);
				});
			} else {
				throw new \Exception("Error while opening " . $log->getLogFilePath());
			}
		}
		throw new \Exception('Can\'t find log class');
	}
}
