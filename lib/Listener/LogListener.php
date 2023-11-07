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

namespace OCA\LogReader\Listener;

use OC\SystemConfig;
use OCA\LogReader\Log\Console;
use OCA\LogReader\Log\Formatter;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Log\BeforeMessageLoggedEvent;
use Symfony\Component\Console\Terminal;

/**
 * @template-implements IEventListener<BeforeMessageLoggedEvent>
 */
class LogListener implements IEventListener {
	private ?Console $console;

	public function __construct(Formatter $formatter, SystemConfig $config) {
		if (defined('OC_CONSOLE') && \OC_CONSOLE) {
			$level = getenv('OCC_LOG');
			if ($level) {
				$terminal = new Terminal();
				$this->console = new Console($formatter, $config, $level, $terminal->getWidth());
			} else {
				$this->console = null;
			}
		} else {
			$this->console = null;
		}
	}


	public function handle(Event $event): void {
		if (!$event instanceof BeforeMessageLoggedEvent) {
			return;
		}

		if ($this->console) {
			$this->console->log($event->getLevel(), $event->getApp(), $event->getMessage());
		}
	}
}
