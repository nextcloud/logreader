<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
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
		$level = getenv('OCC_LOG');
		if ($level) {
			$terminal = new Terminal();
			$this->console = new Console($formatter, $config, $level, $terminal->getWidth());
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
