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

	private string $buffer = '';
	private string $lastLine = '';
	private int $position = 0;
	private int $currentKey = -1;

	public const CHUNK_SIZE = 8192; // how many chars do we try at once to find a new line

	/**
	 * @param resource $handle
	 * @param string $dateFormat
	 * @param string $timezone
	 */
	public function __construct($handle, string $dateFormat, string $timezone) {
		$this->handle = $handle;
		$this->dateFormat = $dateFormat;
		$this->timezone = new \DateTimeZone($timezone);
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
				$this->currentKey++;
				return;
			} elseif ($this->position === 0) {
				$this->lastLine = $this->buffer;
				$this->buffer = '';
				$this->currentKey++;
				return;
			} else {
				$this->fillBuffer();
			}
		}
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
