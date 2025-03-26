<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\LogReader\AppInfo;

use OCA\LogReader\Listener\LogListener;
use OCA\LogReader\Log\Formatter;
use OCA\LogReader\SetupChecks\LogErrors;
use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\Log\BeforeMessageLoggedEvent;
use Psr\Container\ContainerInterface;

class Application extends App implements IBootstrap {
	public function __construct(array $urlParams = []) {
		parent::__construct('logreader', $urlParams);
	}

	public function register(IRegistrationContext $context): void {
		if (defined('OC_CONSOLE') && \OC_CONSOLE) {
			$context->registerEventListener(BeforeMessageLoggedEvent::class, LogListener::class);
		}
		$context->registerService(Formatter::class, function (ContainerInterface $c) {
			return new Formatter(\OC::$SERVERROOT);
		});

		$context->registerSetupCheck(LogErrors::class);
	}

	public function boot(IBootContext $context): void {
	}
}
