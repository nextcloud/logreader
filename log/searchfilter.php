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

class SearchFilter extends \FilterIterator {
	/**
	 * @var string
	 */
	private $query;

	/**
	 * @var string[]
	 */
	private $levels;

	/**
	 * @param LogIterator $iterator
	 * @param string $query
	 */
	public function __construct(LogIterator $iterator, $query) {
		parent::__construct($iterator);
		$this->query = strtolower($query);
		$this->levels = ['Debug', 'Info', 'Warning', 'Error', 'Fatal'];
	}

	private function formatLevel($level) {
		return $this->levels[$level];
	}

	public function accept() {
		$value = $this->getInnerIterator()->current();
		return stripos($value->message, $this->query) !== false
		|| stripos($value->app, $this->query) !== false
		|| stripos($this->formatLevel($value->level), $this->query) !== false;
	}
}
