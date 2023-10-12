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
		$context->registerEventListener(BeforeMessageLoggedEvent::class, LogListener::class);
		$context->registerService(Formatter::class, function (ContainerInterface $c) {
			return new Formatter(\OC::$SERVERROOT);
		});

		$context->registerSetupCheck(LogErrors::class);
	}

	public function boot(IBootContext $context): void {
	}
}
