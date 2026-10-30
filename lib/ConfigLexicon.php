<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\LogReader;

use OCP\Config\Lexicon\Entry;
use OCP\Config\Lexicon\ILexicon;
use OCP\Config\Lexicon\Strictness;
use OCP\Config\ValueType;

/**
 * Config Lexicon for logreader.
 *
 * {@see ILexicon}
 */
class ConfigLexicon implements ILexicon {
	#[\Override]
	public function getStrictness(): Strictness {
		return Strictness::EXCEPTION;
	}

	#[\Override]
	public function getAppConfigs(): array {
		return [
			new Entry(
				Constants::CONFIG_KEY_SHOWNLEVELS,
				ValueType::ARRAY,
				defaultRaw: Constants::LOGGING_LEVELS,
				definition: 'Logging levels to show, used for filtering',
			),
			new Entry(
				Constants::CONFIG_KEY_DATETIMEFORMAT,
				ValueType::STRING,
				defaultRaw: 'local',
				definition: 'Display format of the timestamp',
			),
			new Entry(
				Constants::CONFIG_KEY_RELATIVEDATES,
				ValueType::BOOL,
				defaultRaw: false,
				definition: 'If relative dates should be shown for the timestamp',
			),
			new Entry(
				Constants::CONFIG_KEY_LIVELOG,
				ValueType::BOOL,
				defaultRaw: true,
				definition: 'If automatic updates of the UI are enabled',
			),
		];
	}

	#[\Override]
	public function getUserConfigs(): array {
		return [];
	}
}
