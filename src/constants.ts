/**
 * SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { translate as t } from '@nextcloud/l10n'

/**
 * Mapping from numeric log level (0 - 4) to localized names
 */
export const LOGGING_LEVEL_NAMES = [
	t('logreader', 'Debug'),
	t('logreader', 'Info'),
	t('logreader', 'Warning'),
	t('logreader', 'Error'),
	t('logreader', 'Fatal'),
]

/**
 * Mapping from numeric log level to string
 */
export const LOGGING_LEVEL = [
	'debug',
	'info',
	'warning',
	'error',
	'fatal',
] as const

/**
 * Interval for polling in ms
 */
export const POLLING_INTERVAL = 10000
