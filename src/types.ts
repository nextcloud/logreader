/**
 * Options how to sort rows
 */
export type SortingOptions = '' | 'ascending' | 'descending'

/**
 * Logreader app settings
 */
export interface AppSettings {
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
}

/**
 * Format of a Nextcloud log entry
 */
export interface LogEntry {
	/** Request ID: any log lines related to a single request have the same value */
	reqId: string
	/** Logged incident’s level */
	level: number
	/** Date and time (format and timezone can be configured in config.php) */
	time: string
	/** The IP address of the user (if applicable) */
	remoteAddr?: string
	/** Acting user's id (if applicable) */
	user?: string
	/** Affected app */
	app: string
	/** HTTP method, for example GET, POST, PROPFIND, etc. – empty on occ calls */
	method?: string
	/** Request path (if applicable – empty on occ calls) */
	url?: string
	/** Event information message */
	message: string
	/** User agent (if applicable – empty on occ calls) */
	userAgent?: string
	/** Full exception with trace (if applicable) */
	exception: string
	/** Additional structured data (if applicable) */
	data?: Record<string, unknown>
	/** Nextcloud version at the time of request */
	version: string
}
