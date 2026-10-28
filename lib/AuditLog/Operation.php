<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\LogReader\AuditLog;

/**
 * Operations Log reader writes to the admin audit log, in the form `app.entity.action`.
 * The values are matched by log consumers (filters, alert rules, SIEM imports),
 * so changing one is a breaking change for them. Case names may be renamed.
 *
 * @psalm-api
 */
enum Operation: string {
	case LogLevelUpdated = 'logreader.loglevel.updated';
	case ViewerOpened = 'logreader.viewer.opened';

	public function description(): string {
		return match ($this) {
			self::LogLevelUpdated => 'An admin changed the server log level in the Log reader settings.',
			self::ViewerOpened => 'An admin or delegated admin opened the Log reader in the admin settings; searching, loading more entries and polling are not logged.',
		};
	}
}
