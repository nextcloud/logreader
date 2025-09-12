/**
 * SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Trace entry for exceptions
 */
export interface ITraceLine {
	/**
	 * The file in which the function was called
	 */
	file: string
	/**
	 * Line that was currently parsed when the exception occured
	 */
	line?: number
	/**
	 * Called function name
	 */
	function: string
	/**
	 * Class of the function that was called
	 */
	class: string
	/**
	 * Function arguments (might be a placeholder when sensitive value)
	 */
	args?: readonly string[]
	/**
	 * Type of function access, e.g. '->' or '::'
	 */
	type: string
}

/**
 * Exception entry for log entries
 */
export interface IException {
	Code: number
	CustomMessage: string
	Exception: string
	File: string
	Line: number
	Message: string
	Trace: readonly ITraceLine[]
	Previous?: this
}

/**
 * Common base format of a Nextcloud log entry
 */
interface IBaseLogEntry {
	/** Request ID: any log lines related to a single request have the same value */
	reqId: string
	/** Logged incident’s level */
	level: number
	/** Affected app */
	app: string
	/** Date and time (format and timezone can be configured in config.php) */
	time: string
	/** Event information message */
	message: string
	/** Nextcloud version at the time of request */
	version: string
	/** The IP address of the user (if applicable) */
	remoteAddr?: string
	/** Acting user's id (if applicable) */
	user?: string
	/** HTTP method, for example GET, POST, PROPFIND, etc. – empty on occ calls */
	method?: string
	/** Request path (if applicable – empty on occ calls) */
	url?: string
	/** User agent (if applicable – empty on occ calls) */
	userAgent?: string
	/** Additional structured data (if applicable) */
	data?: string // if parsed: Record<string, unknown>
}

/**
 * Nextcloud 14 version of a log entry, previously the exception was simply a string within the `message` property
 */
export interface INextcloud14LogEntry extends Omit<IBaseLogEntry, 'message'> {
	/** Event information message or exception */
	message: string | IException
}

/**
 * Format of a log entry introduced with Nextcloud 22
 */
export interface INextcloud22LogEntry extends IBaseLogEntry {
	/** Full exception with trace (if applicable) */
	exception?: string | IException
}

/**
 * Raw log entry from log source without fixing the exception
 */
export type IRawLogEntry = INextcloud14LogEntry | INextcloud22LogEntry

/**
 * Fixed version of the log entry where the exception has its own field of type IException
 */
export interface ILogEntry extends Omit<INextcloud22LogEntry, 'exception'> {
	/** Unique ID, appended to each iterator element (see LogController#poll) */
	id: string
	/** Full exception with trace (if applicable) */
	exception?: IException
}
