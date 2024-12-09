<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\LogReader\Command;

use OC\Core\Command\Base;
use OCA\LogReader\Log\Formatter;
use OCA\LogReader\Log\LogIteratorFactory;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Console\Terminal;

class Tail extends Base {
	public const LEVELS = ['Debug', 'Info', 'Warning', 'Error', 'Fatal'];

	private $formatter;
	private $logIteratorFactory;

	public function __construct(Formatter $formatter, LogIteratorFactory $logIteratorFactory) {
		parent::__construct();
		$this->formatter = $formatter;
		$this->logIteratorFactory = $logIteratorFactory;
	}

	protected function configure() {
		$this
			->setName('log:tail')
			->setDescription('Tail the nextcloud logfile')
			->addArgument('lines', InputArgument::OPTIONAL, 'The number of log entries to print', '10')
			->addOption('follow', 'f', InputOption::VALUE_NONE, 'Output new log entries as they appear')
			->addOption('raw', 'r', InputOption::VALUE_NONE, 'Output raw log json instead of formatted log item');
		parent::configure();
	}

	protected function execute(InputInterface $input, OutputInterface $output): int {
		$raw = $input->getOption('raw');
		$count = (int)$input->getArgument('lines');
		$io = new SymfonyStyle($input, $output);
		$logIterator = $this->logIteratorFactory->getLogIterator(Watch::ALL_LEVELS);
		$logIterator = new \LimitIterator($logIterator, 0, $count);
		$logItems = iterator_to_array($logIterator);
		$logItems = array_reverse($logItems);

		if ($raw) {
			foreach ($logItems as $logItem) {
				$output->writeln(json_encode($logItem));
			}
		} else {
			$terminal = new Terminal();
			$totalWidth = $terminal->getWidth();
			// 8 level, 18 for app, 26 for time, 6 for formatting
			$messageWidth = $totalWidth - 8 - 18 - 26 - 6;

			$tableItems = array_map(function (array $logItem) use ($messageWidth) {
				return [
					self::LEVELS[$logItem['level']],
					wordwrap($logItem['app'], 18),
					$this->formatter->formatMessage($logItem, $messageWidth) . "\n",
					$logItem['time'],
				];
			}, $logItems);
			$io->table([
				'Level',
				'App',
				'Message',
				'Time',
			], $tableItems);
		}

		if ($input->getOption('follow')) {
			$watch = new Watch($this->formatter, $this->logIteratorFactory);
			$watch->watch($raw, $output);
		}

		return 0;
	}
}
