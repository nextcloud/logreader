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

class FilterQuery {
	const CMP_EQ = 1;
	const CMP_LT = 2;
	const CMP_GT = 3;
	const CMP_LET = 4;
	const CMP_GET = 5;
	const CMP_NEQ = 6;

	const COMPARISONS = [
		self::CMP_NEQ => '!=',
		self::CMP_LET => '<=',
		self::CMP_GET => '>=',
		self::CMP_EQ => '=',
		self::CMP_LT => '<',
		self::CMP_GT => '>',
	];

	/**
	 * @var array{field: string, cmp: int, value: string}[]
	 */
	private array $comparisons;

	public function __construct(string $query) {
		$parts = array_filter(str_getcsv(str_replace("'", '"', $query), ' '));
		$this->comparisons = array_map([$this, 'parsePart'], $parts);
	}

	/**
	 * @param string $part
	 * @return array{field: string, cmp: int, value: string}
	 */
	private function parsePart(string $part): array {
		$field = 'message';
		$value = $part;
		$cmp = self::CMP_EQ;
		foreach (self::COMPARISONS as $cmpVal => $cmpStr) {
			if (str_contains($part, $cmpStr)) {
				[$field, $value] = explode($cmpStr, $part);
				switch ($field) {
					case "level":
						$value = $this->parseLogLevel($value);
						break;
					case "time":
						$value = new \DateTimeImmutable($value);
						break;
				}
				$cmp = $cmpVal;
				break;
			}
		}
		return [
			'field' => $field,
			'cmp' => $cmp,
			'value' => $value,
		];
	}

	public function matches(array $logItem): bool {
		foreach ($this->comparisons as $comparison) {
			$logValue = $logItem[$comparison['field']] ?? $logItem['data'][$comparison['field']] ?? null;
			if (!$this->compare($logValue, $comparison['value'], $comparison['cmp'])) {
				return false;
			}
		}
		return true;
	}

	private function compare($a, $b, int $cmp): bool {
		switch ($cmp) {
			case self::CMP_EQ:
				if (is_string($a)) {
					return str_contains($a, $b);
				} else {
					return $a == $b;
				}
			case self::CMP_LT:
				return $a < $b;
			case self::CMP_GT:
				return $a > $b;
			case self::CMP_LET:
				return $a <= $b;
			case self::CMP_GET:
				return $a >= $b;
			case self::CMP_NEQ:
				return !$this->compare($a, $b, self::CMP_EQ);
			default:
				return false;
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
			case "WARNING":
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
