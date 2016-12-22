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

	private $currentKey = -1;

	/**
	 * @var string
	 */
	private $dateFormat;

	/**
	 * @param resource $handle
	 * @param string $dateFormat
	 */
	public function __construct($handle, $dateFormat) {
		$this->handle = $handle;
		$this->dateFormat = $dateFormat;
		$this->rewind();
		$this->next();
	}

	function rewind() {
		fseek($this->handle, 0, SEEK_END);
		$this->position = ftell($this->handle);
		$this->currentKey = 0;
	}

	function current() {
		$entry = json_decode($this->lastLine, true);
		if ($this->dateFormat !== \DateTime::ISO8601) {
			$time = \DateTime::createFromFormat($this->dateFormat, $entry['time']);
			$entry['time'] = $time->format(\DateTime::ISO8601);
		}
		return $entry;
	}

	function key() {
		return $this->currentKey;
	}

	function next() {
		$line = '';
		// Loop through each character of the file looking for new lines
		while ($this->position >= 0) {
			fseek($this->handle, $this->position);
			$ch = fgetc($this->handle);
			if ($ch === "\n" || $this->position === 0) {
				if ($line !== '') {
					// Add the first character if at the start of the file,
					// because it doesn't hit the else in the loop
					if ($this->position === 0) {
						$line = $ch . $line;
					}
					$this->lastLine = $line;
					$this->currentKey++;
					return;
				}
			} else {
				$line = $ch . $line;
			}
			$this->position--;
		}
	}

	function valid() {
		return $this->position >= 0;
	}
}
