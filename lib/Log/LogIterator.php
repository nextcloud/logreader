<?php
/**
 * @author Robin Appelman <icewind@owncloud.com>
 *
 * @copyright Copyright (c) 2015, ownCloud, Inc.
 * @license AGPL-3.0
 *
 * This code is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License, version 3,
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 *
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

	/**
	 * @var int
	 */
	private $position = 0;

	/**
	 * @var string
	 */
	private $lastLine;

	/**
	 * @var string
	 */
	private $currentLine = '';

	private $currentKey = -1;

	/**
	 * @var string
	 */
	private $dateFormat;

	private $timezone;

	public const CHUNK_SIZE = 100; // how many chars do we try at once to find a new line

	/**
	 * @param resource $handle
	 * @param string $dateFormat
	 * @param string $timezone
	 */
	public function __construct($handle, $dateFormat, $timezone) {
		$this->handle = $handle;
		$this->dateFormat = $dateFormat;
		$this->timezone = new \DateTimeZone($timezone);
		$this->rewind();
		$this->next();
	}

	public function rewind(): void {
		fseek($this->handle, 0, SEEK_END);
		$this->position = ftell($this->handle) - self::CHUNK_SIZE;
		$this->currentKey = 0;
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

	public function next(): void {
		$this->currentLine = '';

		// Loop through each character of the file looking for new lines
		while ($this->position > 0) {
			fseek($this->handle, $this->position);
			$chars = fread($this->handle, self::CHUNK_SIZE);
			$newlinePos = strrpos($chars, "\n");
			if ($newlinePos !== false) {
				$this->currentLine = substr($chars, $newlinePos + 1) . $this->currentLine;
				$this->lastLine = $this->currentLine;
				$this->currentKey++;
				$this->position -= (self::CHUNK_SIZE - $newlinePos);
				return;
			} else {
				$this->currentLine = $chars . $this->currentLine;
				if ($this->position >= self::CHUNK_SIZE) {
					$this->position -= self::CHUNK_SIZE;
				} else {
					$remaining = $this->position;
					fseek($this->handle, 0);
					$chars = fread($this->handle, $remaining);
					$this->currentLine = $chars . $this->currentLine;
					$this->lastLine = $this->currentLine;
					$this->position = 0;
				}
			}
		}
	}

	public function valid(): bool {
		if (!is_resource($this->handle)) {
			return false;
		}

		if ($this->position > 0) {
			return true;
		}

		if ($this->currentLine === '') {
			return false;
		}

		return true;
	}
}
