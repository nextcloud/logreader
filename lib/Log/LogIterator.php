<?php

/**
 * SPDX-FileCopyrightText: 2016-2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-FileCopyrightText: 2015 ownCloud, Inc.
 * SPDX-License-Identifier: AGPL-3.0-only
 */
namespace OCA\LogReader\Log;

/**
 * @template-implements \Iterator<int,array>
 */
class LogIterator implements \Iterator {
	/**
	 * @var resource
	 */
	private $handle;
	private string $dateFormat;
	private \DateTimeZone $timezone;
	/**
	 * @var int[]|null
	 */
	private ?array $levels;

	private string $buffer = '';
	private string $lastLine = '';
	private int $position = 0;
	private int $currentKey = -1;

	public const CHUNK_SIZE = 8192; // how many chars do we try at once to find a new line

	/**
	 * @param resource $handle
	 * @param string $dateFormat
	 * @param string $timezone
	 * @param int[]|null $levels Array of log levels to include, null to include all
	 */
	public function __construct($handle, string $dateFormat, string $timezone, ?array $levels = null) {
		$this->handle = $handle;
		$this->dateFormat = $dateFormat;
		$this->timezone = new \DateTimeZone($timezone);
		$this->levels = $levels;
		$this->rewind();
	}

	public function rewind(): void {
		fseek($this->handle, 0, SEEK_END);
		$this->position = ftell($this->handle);
		$this->lastLine = '';
		$this->buffer = '';
		$this->currentKey = -1;
		$this->next();
	}

	/**
	 * @return array
	 */
	#[\ReturnTypeWillChange]
	public function current() {
		$entry = json_decode($this->lastLine, true);
		if ($this->dateFormat !== \DateTime::ATOM) {
			if (isset($entry['time'])) {
				$time = \DateTime::createFromFormat($this->dateFormat, $entry['time'], $this->timezone);
				if ($time) {
					$entry['time'] = $time->format(\DateTime::ATOM);
				}
			}
		}
		return $entry;
	}

	public function key(): int {
		return $this->currentKey;
	}

	private function fillBuffer(): void {
		$chunkSize = min($this->position, self::CHUNK_SIZE);
		$this->position -= $chunkSize;
		fseek($this->handle, $this->position);
		$chunk = fread($this->handle, $chunkSize);
		$this->buffer = $chunk . $this->buffer;
	}

	public function next(): void {
		// Loop through each character of the file looking for new lines
		while ($this->position >= 0) {
			$newlinePos = strrpos($this->buffer, "\n");
			if ($newlinePos !== false) {
				if ($newlinePos + 1 === strlen($this->buffer)) {
					// try again with truncated buffer if it ends with newline, i.e. on first call
					$this->buffer = substr($this->buffer, 0, $newlinePos);
					continue;
				}
				$this->lastLine = substr($this->buffer, $newlinePos + 1);
				$this->buffer = substr($this->buffer, 0, $newlinePos);

				// Skip lines that don't match the log level
				if ($this->levels !== null && !$this->matchesLevelFilter($this->lastLine)) {
					continue;
				}

				$this->currentKey++;
				return;
			} elseif ($this->position === 0) {
				$this->lastLine = $this->buffer;
				$this->buffer = '';

				if ($this->levels !== null && !$this->matchesLevelFilter($this->lastLine)) {
					return;
				}

				$this->currentKey++;
				return;
			} else {
				$this->fillBuffer();
			}
		}
	}

	/**
	 * Check if a log line matches the allowed levels.
	 * Inaccurate check before full JSON decoding,
	 * CallbackFilterIterator still required to validate the entry.
	 */
	private function matchesLevelFilter(string $line): bool {
		$levelPos = strpos($line, '"level":');
		if ($levelPos === false) {
			return false;
		}
		$digit = substr($line, $levelPos + 8, 1);
		if (!ctype_digit($digit)) {
			return false;
		}
		$level = (int)$digit;
		return in_array($level, $this->levels, true);
	}

	public function valid(): bool {
		if (!is_resource($this->handle)) {
			return false;
		}

		if ($this->lastLine === '' && $this->position === 0) {
			return false;
		}

		return true;
	}
}
