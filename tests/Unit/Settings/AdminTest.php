<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\LogReader\Tests\Unit\Settings;

use OCA\LogReader\Service\SettingsService;
use OCA\LogReader\Settings\Admin;
use OCA\LogReader\Tests\AuditLog\AuditEventAssert;
use OCP\AppFramework\Services\IInitialState;
use OCP\EventDispatcher\IEventDispatcher;
use OCP\Log\Audit\CriticalActionPerformedEvent;
use Test\TestCase;

class AdminTest extends TestCase {
	public function testGetFormIsAudited(): void {
		$settingsService = $this->createStub(SettingsService::class);
		$settingsService->method('getAppSettings')->willReturn([]);
		$eventDispatcher = $this->createMock(IEventDispatcher::class);
		$eventDispatcher->expects($this->once())
			->method('dispatchTyped')
			->with($this->callback(fn (CriticalActionPerformedEvent $event) => $event->getLogMessage() === 'Log reader opened'
				&& $event->getParameters() === []
				&& AuditEventAssert::hasOperation($event, 'logreader.viewer.opened')));

		$admin = new Admin('logreader', $this->createStub(IInitialState::class), $settingsService, $eventDispatcher);
		$admin->getForm();
	}
}
