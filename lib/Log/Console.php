<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2023 Robin Appelman <robin@icewind.nl>
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
use OCA\LogReader\Command\Tail;

/**
 * Utility to write log messages to the console as they are emitted
 */
class Console extends LogDetails {
	private int $level;
	private int $terminalWidth;
	private Formatter $formatter;

	public function __construct(Formatter $formatter, SystemConfig $config, string $level, int $terminalWidth) {
		parent::__construct($config);
		$this->formatter = $formatter;
		$this->level = self::parseLogLevel($level);
		$this->terminalWidth = $terminalWidth;
	}

	public function log(int $level, string $app, array $entry) {
		if ($level >= $this->level) {
			$messageWidth = $this->terminalWidth - 8 - 18 - 6;

			$entry = $this->logDetails($app, $entry, $level);

			$lines = explode("\n", $this->formatter->formatMessage($entry, $messageWidth));
			$lines[0] = str_pad(Tail::LEVELS[$level], 8) . ' ' .
				str_pad(wordwrap($app, 18), 18) . ' ' .
				str_pad($lines[0], $messageWidth);

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

		switch (strtoupper($level)) {
			case "DEBUG":
				return 0;
			case "INFO":
				return 1;
			case "WARN":
				return 2;
			case "ERROR":
				return 3;
			case "FATAL":
				return 4;
			default:
				throw new \Exception("Unknown log level $level");
		}
	}
}
