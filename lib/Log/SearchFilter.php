<?php
/**
 * SPDX-FileCopyrightText: 2016-2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-FileCopyrightText: 2015 ownCloud, Inc.
 * SPDX-License-Identifier: AGPL-3.0-only
 */
namespace OCA\LogReader\Log;

/**
 * @template-extends \FilterIterator<int,array,\Iterator<int,array>>
 */
class SearchFilter extends \FilterIterator {
	/**
	 * @var string
	 */
	private $query;

	/**
	 * @var string[]
	 */
	private $levels;

	public function __construct(\Iterator $iterator, string $query) {
		parent::__construct($iterator);
		$this->rewind();
		$this->query = strtolower($query);
		$this->levels = ['Debug', 'Info', 'Warning', 'Error', 'Fatal'];
	}

	private function formatLevel(int $level): string {
		return isset($this->levels[$level]) ? $this->levels[$level] : 'Unknown';
	}

	public function accept(): bool {
		if (!$this->query) {
			return true;
		}
		$value = $this->current();
		return $this->inMessage($value['message'] ?? '', $this->query)
			|| stripos($value['app'] ?? '', $this->query) !== false
			|| stripos($value['reqId'] ?? '', $this->query) !== false
			|| stripos($value['user'] ?? '', $this->query) !== false
			|| stripos($value['url'] ?? '', $this->query) !== false
			|| stripos($this->formatLevel($value['level'] ?? -1), $this->query) !== false;
	}

	private function inMessage($message, string $query): bool {
		if (is_string($message)) {
			return stripos($message, $query) !== false;
		} elseif (isset($message['Exception'])) {
			return stripos($message['Exception'], $query) !== false
				|| stripos($message['Message'] ?? '', $query) !== false;
		}
		return false;
	}
}
