<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\LogReader\Exception;

class UnsupportedLogTypeException extends \Exception {
	public function __construct() {
		parent::__construct('Logreader application only supports "file" log_type');
	}
}
