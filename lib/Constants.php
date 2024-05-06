<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


namespace OCA\LogReader;

// !! Keep in sync with src/constants.ts
class Constants {
	// Used config Keys

	/**
	 * Logging levels to show, used for filtering
	 */
	public const CONFIG_KEY_SHOWNLEVELS = 'shownLevels';
	/**
	 * The backend logging level
	 */
	public const CONFIG_KEY_LOGLEVEL = 'logLevel';
	/**
	 * Display format of the timestamp
	 */
	public const CONFIG_KEY_DATETIMEFORMAT = 'dateTimeFormat';
	/**
	 * If relative dates should be shown for the timestamp (e.g. '3 hours ago')
	 */
	public const CONFIG_KEY_RELATIVEDATES = 'relativedates';
	/**
	 * If automatic updates of the UI are enabled (polling for new entries)
	 */
	public const CONFIG_KEY_LIVELOG = 'liveLog';

	/**
	 * All valid config keys
	 */
	public const CONFIG_KEYS = [
		self::CONFIG_KEY_SHOWNLEVELS,
		self::CONFIG_KEY_LOGLEVEL,
		self::CONFIG_KEY_DATETIMEFORMAT,
		self::CONFIG_KEY_RELATIVEDATES,
		self::CONFIG_KEY_LIVELOG,
	];

	// other constants
	public const LOGGING_LEVELS = [0, 1, 2, 3, 4];
	public const LOGGING_LEVEL_NAMES = [
		'debug',
		'info',
		'warn',
		'error',
		'fatal',
	];
}
