<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2018 Robin Appelman <robin@icewind.nl>
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

class Formatter {
	private $root;

	public function __construct(string $root) {
		$this->root = $root;
	}

	public function formatMessage($logItem, int $width) {
		if (isset($logItem['exception'])) {
			return $this->formatException($logItem['exception'], $width);
		}
		if (is_array($logItem['message']) && isset($logItem['message']['Exception'])) {
			return $this->formatException($logItem['message'], $width);
		}
		return wordwrap($logItem['message'], $width);
	}

	private function formatException(array $e, int $width) {
		$largestIndex = count($e['Trace']) - 1;
		$largestIndexWidth = strlen((string)$largestIndex);
		$message = wordwrap($e['Exception'] . ': ' . $e['Message'] . ' at ' . $this->getFileAndLine($e), $width) . "\n\n";
		$message .= implode("\n", array_map(function ($index, $trace) use ($largestIndexWidth, $width) {
			return $this->formatTraceLine($index, $trace, $largestIndexWidth, $width);
		}, array_keys($e['Trace']), array_values($e['Trace'])));

		if (isset($e['Previous'])) {
			$message .= "\n\n" . 'Caused by ' . $this->formatException($e['Previous'], $width);
		}
		return $message;
	}

	private function formatTraceLine(int $index, array $trace, int $largestIndexWidth, int $width): string {
		$whiteSpace = str_repeat(' ', $largestIndexWidth - strlen((string)$index));
		$method = ($trace['class'] ?? '') . ($trace['type'] ?? '') . $trace['function'];
		$argumentWidth = $width - $largestIndexWidth - strlen($method) - 5;
		$arguments = array_map(function ($arg) use ($argumentWidth) {
			$base = str_replace("\n", '', $this->formatArgument($arg, 0));
			$showInline = strlen($base) < $argumentWidth;
			return $showInline ? $base : substr($base, 0, $argumentWidth - 8) . ' ... ' . substr($base, -2);
		}, $trace['args'] ?? []);

		$argumentsString = implode(', ', $arguments);
		$argumentWhiteSpace = str_repeat(' ', $largestIndexWidth + 2);
		if ($argumentsString && strlen($argumentsString) < $argumentWidth) {
			return $whiteSpace . $index . '. ' . $this->getFileAndLine($trace, $argumentWidth) . "\n" .
				$argumentWhiteSpace . $method . '(' .
				$argumentsString . ')';
		} else {
			return $whiteSpace . $index . '. ' . $this->getFileAndLine($trace, $argumentWidth) . "\n" .
				$argumentWhiteSpace . $method . "(\n" .
				implode(",\n", array_map(function ($argumentLine) use ($argumentWhiteSpace) {
					return $argumentWhiteSpace . '  ' . trim($argumentLine);
				}, $arguments)) . "\n" .
				$argumentWhiteSpace . ")";
		}
	}

	private function formatArgument($argument, int $whiteSpace, int $depth = 0, bool $forceObject = false): string {
		$leadingSpace = str_repeat(' ', $whiteSpace * $depth);
		$glue = ($whiteSpace) ? ",\n" : ',';
		if (is_array($argument) && isset($argument['__class__'])) {
			$className = $argument['__class__'];
			unset($argument['__class__']);
			return $leadingSpace . $className . ' ' . trim($this->formatArgument($argument, $whiteSpace, $depth, true));
		} elseif (is_array($argument)) {
			if (count($argument) === 0) {
				return $leadingSpace . ($forceObject ? '{}' : '[]');
			}
			$isObject = $forceObject || array_keys($argument) !== range(0, count($argument) - 1);
			if ($isObject) {
				$keyWhitespace = str_repeat(' ', $whiteSpace * ($depth + 1));
				return $leadingSpace . "{\n" .
					implode($glue, array_map(function ($key, $value) use ($whiteSpace, $depth, $keyWhitespace) {
						return $keyWhitespace . $key . ':' . trim($this->formatArgument($value, $whiteSpace, $depth + 1));
					}, array_keys($argument), array_values($argument))) . ($whiteSpace ? "\n" : '') . $leadingSpace . '}';
			} else {
				return $leadingSpace . "[\n" .
					implode($glue, array_map(function ($value) use ($whiteSpace, $depth) {
						return $this->formatArgument($value, $whiteSpace, $depth + 1);
					}, $argument)) . ($whiteSpace ? "\n" : '') . $leadingSpace . ']';
			}
		} else {
			$value = json_encode($argument, $whiteSpace ? JSON_PRETTY_PRINT : 0);
			return $leadingSpace . $value;
		}
	}

	private function getFileAndLine(array $item, int $width = 64): string {
		$file = $item['file'] ?? $item['File'] ?? null;
		$line = $item['line'] ?? $item['Line'] ?? null;
		if ($file && $line) {
			if (substr($file, 0, strlen($this->root) + 1) === $this->root . '/') {
				$file = substr($file, strlen($this->root) + 1);
			}
			$postFix = ' line ' . $line;
			$fileWidth = $width - strlen($postFix) - 4;
			$prefix = '';
			$count = 0;
			while (strlen($file) > $fileWidth && strpos($file, '/') !== false && $count < 20) {
				$file = substr($file, strpos($file, '/') + 1);
				$prefix = '.../';
				$count++;
			}
			return $prefix . $file . $postFix;
		} else {
			return '<<closure>>';
		}
	}
}
