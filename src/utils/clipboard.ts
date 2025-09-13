/**
 * SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { translate as t } from '@nextcloud/l10n'

/**
 * Copy text to clipboard if it fails (e.g. not secure context (https, localhost...))
 * a prompt will be opened for the user to copy the text manually
 *
 * @param text The text to copy
 * @return true if automatic copy suceeded, false if prompt was used
 */
export async function copyToCipboard(text: string) {
	try {
		await window.navigator.clipboard.writeText(text)
		return true
	} catch (e) {
		window.prompt(
			t('logreader', 'Could not copy to clipboard, please copy manually:'),
			text,
		)
	}
	return false
}
