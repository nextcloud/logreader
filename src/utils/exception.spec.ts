/**
 * SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { IException } from '../interfaces/ILogEntry'

import { describe, expect, it } from 'vitest'
import { parseException } from './exception'

describe('utils:exception', () => {
	describe('parseException', () => {
		it('simply returns new style exceptions', () => {
			const exception = {
				Exception: 'GenericException',
			}

			expect(parseException(exception as IException)).toBe(exception)
		})

		it('parses nested json exception', () => {
			const exception = {
				Exception: 'GenericException',
			}

			expect(parseException(JSON.stringify(exception))).toEqual(exception)
		})

		it('parses old style exception', () => {
			const exception = {
				Exception: 'GenericException',
			}

			expect(parseException('Exception: ' + JSON.stringify(exception))).toEqual(exception)
		})

		it('parses old style exception with trace', () => {
			const exception = {
				Exception: 'GenericException',
				// string instead of array
				Trace: '1 strstr\n2 /srv/www/index.php(2):main\n3 [builtin]:helper\n4 :function',
			}

			const modernException = {
				Exception: 'GenericException',
				Trace: [
					{
						number: '1',
						function: 'strstr',
						file: false,
					},
					{
						number: '2',
						file: '/srv/www/index.php',
						line: 2,
						function: 'main',
					},
					{
						number: '3',
						file: '[builtin]',
						line: undefined,
						function: 'helper',
					},
					{
						number: '4',
						file: '',
						line: undefined,
						function: 'function',
					},
				],
			}

			expect(parseException('Exception: ' + JSON.stringify(exception))).toEqual(modernException)
		})

		it('parses nested json with unescaped newline', () => {
			const exception = {
				Exception: 'GenericException',
				Message: 'With\nnewline',
			}
			const input = 'Exception: {"Exception":"GenericException", "Message": "With\nnewline"}'

			expect(parseException(input)).toEqual(exception)
		})
	})
})
