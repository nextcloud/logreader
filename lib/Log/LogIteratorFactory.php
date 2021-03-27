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

class LogIteratorFactory {
	private $config;
	private $logFileProvider;

	public function __construct(IConfig $config, LogFileProvider $logFileProvider) {
		$this->config = $config;
		$this->logFileProvider = $logFileProvider;
	}

	/**
	 * @return \Iterator
	 * @param string $levelsString
	 * @param string $logIdentifier
	 * @throws \Exception
	 */
	public function getLogIterator($levelsString, string $logIdentifier = null) {
		$levels = str_split($levelsString);
		$levels = array_map(function ($level) {
			return $level === '1';
		}, $levels);
		$dateFormat = $this->config->getSystemValue('logdateformat', \DateTime::ATOM);
		$timezone = $this->config->getSystemValue('logtimezone', 'UTC');

		if ($logIdentifier) {
			$logFilePath = $this->logFileProvider->getLogFilePathById($logIdentifier) ??
				$this->logFileProvider->getDefaultLogFilePath();
		} else {
			$logFilePath = $this->logFileProvider->getDefaultLogFilePath();
		}

		return $this->getIterator(
			$logFilePath,
			$dateFormat,
			$timezone,
			$levels
		);
	}

	private function getIterator(
		string $logFilePath,
		string $dateFormat,
		string $timezone,
		array $levels
	): \CallbackFilterIterator {
		$handle = fopen($logFilePath, 'rb');
		if ($handle) {
			$iterator = new LogIterator($handle, $dateFormat, $timezone);
			return new \CallbackFilterIterator($iterator, function ($logItem) use ($levels) {
				return $logItem && isset($levels[$logItem['level']]) && $levels[$logItem['level']];
			});
		} else {
			throw new \Exception('Error while opening ' . $logFilePath);
		}
	}
}
