<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\LogReader\Log;

use OCA\LogReader\Exception\UnsupportedLogTypeException;
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
			throw new UnsupportedLogTypeException();
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
				throw new \Exception('Error while opening ' . $log->getLogFilePath());
			}
		}
		throw new \Exception('Can\'t find log class');
	}
}
