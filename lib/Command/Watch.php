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

namespace OCA\LogReader\Command;

use OC\Core\Command\Base;
use OC\Core\Command\InterruptedException;
use OCA\LogReader\Log\Formatter;
use OCA\LogReader\Log\LogIteratorFactory;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Terminal;

class Watch extends Base {
	public const LEVELS = ['Debug', 'Info', 'Warning', 'Error', 'Fatal'];
	public const ALL_LEVELS = [0, 1, 2, 3, 4];

	private $formatter;
	private $logIteratorFactory;

	public function __construct(Formatter $formatter, LogIteratorFactory $logIteratorFactory) {
		parent::__construct();
		$this->formatter = $formatter;
		$this->logIteratorFactory = $logIteratorFactory;
	}

	protected function configure() {
		$this
			->setName('log:watch')
			->setDescription('Watch the nextcloud logfile')
			->addOption('raw', 'r', InputOption::VALUE_NONE, 'Output raw log json instead of formatted log item');
		parent::configure();
	}

	private function getLastLogId() {
		$logIterator = $this->logIteratorFactory->getLogIterator(self::ALL_LEVELS);
		$logIterator->next();
		if ($logIterator->current() !== null) {
			return $logIterator->current()['reqId'];
		}
	}

	protected function execute(InputInterface $input, OutputInterface $output): int {
		$raw = $input->getOption('raw');
		return $this->watch($raw, $output);
	}

	public function watch(bool $raw, OutputInterface $output): int {
		$terminal = new Terminal();
		$totalWidth = $terminal->getWidth();
		// 8 level, 18 for app, 26 for time, 6 for formatting
		$messageWidth = $totalWidth - 8 - 18 - 26 - 6;
		$lastId = $this->getLastLogId();

		while (true) {
			usleep(100 * 1000);
			try {
				$this->abortIfInterrupted();
			} catch (InterruptedException $e) {
				break;
			}

			$id = $this->getLastLogId();
			if ($id !== $lastId) {
				$iterator = $this->logIteratorFactory->getLogIterator(self::ALL_LEVELS);
				$iterator->next();

				$lines = [];

				while ($iterator->valid() && count($lines) < 10) {
					$line = $iterator->current();

					if ($line['reqId'] === $lastId) {
						break;
					}

					if (!is_null($line)) {
						$lines[] = $line;
					}
					$iterator->next();
				}

				array_reverse($lines);

				foreach ($lines as $line) {
					if ($raw) {
						$output->writeln(json_encode($line));
					} else {
						$this->printItem($line, $output, $messageWidth);
						$output->writeln("");
					}
				}

				$lastId = $id;
			}
		}

		return 0;
	}

	private function printItem(array $logItem, OutputInterface $output, int $messageWidth) {
		$widths = [8, 18, $messageWidth, 26];
		$parts = [
			self::LEVELS[$logItem['level']],
			wordwrap($logItem['app'], 18),
			$this->formatter->formatMessage($logItem, $messageWidth),
			$logItem['time'],
		];

		$partLines = array_map(function ($part) {
			return explode("\n", $part);
		}, $parts);
		$lineCount = array_reduce($partLines, function (int $count, array $lines) {
			return max($count, count($lines));
		}, 0);
		$partLines = array_map(function (array $lines) use ($lineCount) {
			return array_pad($lines, $lineCount, '');
		}, $partLines);
		$partLines = array_map(function (array $lines, int $width) {
			return array_map(function (string $line) use ($width) {
				return str_pad($line, $width);
			}, $lines);
		}, $partLines, $widths);
		$lines = array_map(function (int $lineNumber) use ($partLines) {
			$partsForLine = array_map(function (array $lines) use ($lineNumber) {
				return $lines[$lineNumber];
			}, $partLines);
			return implode(' ', $partsForLine);
		}, range(0, $lineCount - 1));

		foreach ($lines as $line) {
			$output->writeln('  ' . $line);
		}
	}
}
