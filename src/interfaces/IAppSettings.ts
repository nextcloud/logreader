/**
 * SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Logreader app settings
 */
export interface IAppSettings {
	/**
	 * Logging levels to display messages for
	 */
	shownLevels: Array<0 | 1 | 2 | 3 | 4>
	/**
	 * How the log time should be displayed
	 * - `local` Show in client local time format
	 * - `utc` Same as `local` but in UTC timezone
	 * - `relative`Same as `local` but show near times as relative (e.g. "2 seconds ago")
	 * - `raw` The same as in the logfile
	 */
	dateTimeFormat: 'local' | 'raw' | 'utc' | 'relative'
	/**
	 * Wether the log should be polled
	 */
	liveLog: boolean
	/**
	 * Wether backend is enable = logging is set to file
	 */
	enabled: boolean
	/**
	 * The loglevel which is currently set on the server
	 */
	logLevel: 0 | 1 | 2 | 3 | 4
}
