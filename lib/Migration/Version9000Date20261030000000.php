<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\LogReader\Migration;

use Closure;
use OCA\LogReader\Constants;
use OCP\IAppConfig;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

/**
 * Store the date time format as plain string instead of a JSON encoded string
 *
 * @psalm-api
 */
class Version9000Date20261030000000 extends SimpleMigrationStep {
	public function __construct(
		private readonly IAppConfig $appConfig,
	) {
	}

	#[\Override]
	public function postSchemaChange(IOutput $output, Closure $schemaClosure, array $options): void {
		if (!$this->appConfig->hasKey('logreader', Constants::CONFIG_KEY_DATETIMEFORMAT)) {
			return;
		}

		$value = $this->appConfig->getValueString('logreader', Constants::CONFIG_KEY_DATETIMEFORMAT);
		$decoded = json_decode($value);
		if (is_string($decoded)) {
			$this->appConfig->setValueString('logreader', Constants::CONFIG_KEY_DATETIMEFORMAT, $decoded);
		}
	}
}
