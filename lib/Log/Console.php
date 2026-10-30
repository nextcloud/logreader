<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\LogReader\Log;

use OC\Log\LogDetails;
use OC\SystemConfig;
use OCA\LogReader\Command\Tail;

/**
 * Utility to write log messages to the console as they are emitted
 */
class Console extends LogDetails {
	private readonly int $level;

	public function __construct(
		private readonly Formatter $formatter,
		SystemConfig $config,
		string $level,
		private readonly int $terminalWidth,
	) {
		parent::__construct($config);
		$this->level = self::parseLogLevel($level);
	}

	public function log(int $level, string $app, array $entry) {
		if ($level >= $this->level) {
			$messageWidth = $this->terminalWidth - 8 - 18 - 6;

			$entry = $this->logDetails($app, $entry, $level);

			$lines = explode("\n", $this->formatter->formatMessage($entry, $messageWidth));
			$lines[0] = str_pad(Tail::LEVELS[$level], 8) . ' '
				. str_pad(wordwrap($app, 18), 18) . ' '
				. str_pad($lines[0], $messageWidth);

			for ($i = 1; $i < count($lines); $i++) {
				$lines[$i] = str_repeat(' ', 8 + 18 + 2) . $lines[$i];
			}

			foreach ($lines as $line) {
				fwrite(STDERR, $line . "\n");
			}
			fwrite(STDERR, "\n");
		}
	}

	private static function parseLogLevel(string $level): int {
		if (is_numeric($level)) {
			return (int)$level;
		}

		return match (strtoupper($level)) {
			'DEBUG' => 0,
			'INFO' => 1,
			'WARN' => 2,
			'ERROR' => 3,
			'FATAL' => 4,
			default => throw new \Exception("Unknown log level $level"),
		};
	}
}
