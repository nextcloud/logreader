<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\LogReader\SetupChecks;

use OCA\LogReader\Exception\UnsupportedLogTypeException;
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
			if ($e instanceof UnsupportedLogTypeException) {
				return SetupResult::info($e->getMessage());
			}

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
		$startTime = microtime(true);
		foreach ($logIterator as $logItem) {
			if (!isset($logItem['time'])) {
				continue;
			}
			$time = \DateTime::createFromFormat(\DateTime::ATOM, $logItem['time']);
			if ($time < $limit) {
				break;
			}
			$count[$logItem['level']]++;
			if (microtime(true) > $startTime + 5) {
				$limit = $time;
				break;
			}
		}
		if (array_sum($count) === 0) {
			return SetupResult::success($this->l10n->t('No errors in the logs since %s', $this->dateFormatter->formatDateTime($limit)));
		} elseif ($count[self::LEVEL_ERROR] + $count[self::LEVEL_FATAL] > 0) {
			return SetupResult::warning(
				$this->l10n->n(
					'%n error in the logs since %s',
					'%n errors in the logs since %s',
					$count[self::LEVEL_ERROR] + $count[self::LEVEL_FATAL],
					[$this->dateFormatter->formatDateTime($limit)],
				)
			);
		} else {
			return SetupResult::info(
				$this->l10n->n(
					'%n warning in the logs since %s',
					'%n warnings in the logs since %s',
					$count[self::LEVEL_WARNING],
					[$this->dateFormatter->formatDateTime($limit)],
				)
			);
		}
	}
}
