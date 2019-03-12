<?php declare(strict_types=1);
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
use OCA\LogReader\Log\Formatter;
use OCA\LogReader\Log\LogIteratorFactory;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\StringInput;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Console\Terminal;

class Tail extends Base {
	const LEVELS = ['Debug', 'Info', 'Warning', 'Error', 'Fatal'];

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
			->addArgument('lines', InputArgument::OPTIONAL, 'The number of log entries to print', 10)
			->addOption('follow', 'f', InputOption::VALUE_NONE, 'Output new log entries as they appear');
		parent::configure();
	}

	protected function execute(InputInterface $input, OutputInterface $output) {
		$count = (int)$input->getArgument('lines');
		$terminal = new Terminal();
		$totalWidth = $terminal->getWidth();
		// 8 level, 18 for app, 26 for time, 6 for formatting
		$messageWidth = $totalWidth - 8 - 18 - 26 - 6;
		$io = new SymfonyStyle($input, $output);
		$logIterator = $this->logIteratorFactory->getLogIterator('11111');
		$i = 0;
		$tableItems = [];
		foreach ($logIterator as $logItem) {
			$i++;
			if ($i > $count) {
				break;
			}
			$tableItems[] = [
				self::LEVELS[$logItem['level']],
				wordwrap($logItem['app'], 18),
				$this->formatter->formatMessage($logItem['message'], $messageWidth) . "\n",
				$logItem['time']
			];
		}
		$io->table([
			'Level',
			'App',
			'Message',
			'Time'
		], array_reverse($tableItems));

		if ($input->getOption('follow')) {
			$watch = new Watch($this->formatter, $this->logIteratorFactory);
			$watch->run(new StringInput(''), $output);
		}
	}
}
