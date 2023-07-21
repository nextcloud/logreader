/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from 'vitest'
import { LOGGING_LEVEL, LOGGING_LEVEL_NAMES } from './constants'

test('constants - every level has a name', () => {
	expect(LOGGING_LEVEL.length).toBe(LOGGING_LEVEL_NAMES.length)
})
