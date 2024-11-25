<?php

declare(strict_types=1);

/**
 * @copyright Copyright (c) 2023 Côme Chilliet <come.chilliet@nextcloud.com>
 *
 * @author Côme Chilliet <come.chilliet@nextcloud.com>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
namespace OCA\LogReader\SetupChecks;

use OCA\LogReader\Log\LogIteratorFactory;
use OCP\IConfig;
use OCP\IDateTimeFormatter;
use OCP\IL10N;
use OCP\SetupCheck\ISetupCheck;
use OCP\SetupCheck\SetupResult;

class LogErrors implements ISetupCheck {
	private const LEVEL_WARNING = 2;
	private const LEVEL_ERROR = 3;
	private const LEVEL_FATAL = 4;

	public function __construct(
		private IL10N $l10n,
		private IConfig $config,
		private IDateTimeFormatter $dateFormatter,
		private LogIteratorFactory $logIteratorFactory,
	) {
	}

	public function getName(): string {
		return $this->l10n->t('Errors in the log');
	}

	public function getCategory(): string {
		return 'system';
	}

	public function run(): SetupResult {
		try {
			$logIterator = $this->logIteratorFactory->getLogIterator([self::LEVEL_WARNING,self::LEVEL_ERROR,self::LEVEL_FATAL]);
		} catch (\Exception $e) {
			return SetupResult::error(
				$this->l10n->t('Failed to get an iterator for log entries: %s', [$e->getMessage()])
			);
		}
		$count = [
			self::LEVEL_WARNING => 0,
			self::LEVEL_ERROR => 0,
			self::LEVEL_FATAL => 0,
		];
		$limit = new \DateTime('7 days ago');
		foreach ($logIterator as $logItem) {
			if (!isset($logItem['time'])) {
				continue;
			}
			$time = \DateTime::createFromFormat(\DateTime::ATOM, $logItem['time']);
			if ($time < $limit) {
				break;
			}
			$count[$logItem['level']]++;
		}
		if (array_sum($count) === 0) {
			return SetupResult::success($this->l10n->t('No errors in the logs since %s', $this->dateFormatter->formatDate($limit)));
		} elseif ($count[self::LEVEL_ERROR] + $count[self::LEVEL_FATAL] > 0) {
			return SetupResult::warning(
				$this->l10n->n(
					'%n error in the logs since %s',
					'%n errors in the logs since %s',
					$count[self::LEVEL_ERROR] + $count[self::LEVEL_FATAL],
					[$this->dateFormatter->formatDate($limit)],
				)
			);
		} else {
			return SetupResult::info(
				$this->l10n->n(
					'%n warning in the logs since %s',
					'%n warnings in the logs since %s',
					$count[self::LEVEL_WARNING],
					[$this->dateFormatter->formatDate($limit)],
				)
			);
		}
	}
}
