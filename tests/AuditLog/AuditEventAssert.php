<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\LogReader\Tests\AuditLog;

use OCP\Log\Audit\CriticalActionPerformedEvent;

class AuditEventAssert {
	/**
	 * Servers before the operation was added to CriticalActionPerformedEvent do not keep it
	 */
	public static function hasOperation(CriticalActionPerformedEvent $event, string $operation): bool {
		return !method_exists($event, 'getOperation') || $event->getOperation() === $operation;
	}
}
