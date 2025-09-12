/**
 * SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest'
import { parseLogFile, parseLogString } from './logfile'

describe('utils:logfile', () => {
	it('can parse a file', async () => {
		// simply test that files are handled, the inner handling is checked by parseLogString
		const file = new File(['{ "app": "myApp" }'], 'log')
		expect(await parseLogFile(file)).toEqual([{ app: 'myApp' }])
	})

	it('can parse server style logs', async () => {
		const input = '{ "app": "myApp" }\n{ "app": "myApp2" }'
		const expected = [{ app: 'myApp' }, { app: 'myApp2' }]

		const output = await parseLogString(input)
		expect(output).toEqual(expected)
	})

	it('can parse logs without newline', async () => {
		const input = '{ "app": "myApp" }{ "app": "myApp2" }'
		const expected = [{ app: 'myApp' }, { app: 'myApp2' }]

		const output = await parseLogString(input)
		expect(output).toEqual(expected)
	})

	it('can parse formatted logs', async () => {
		const input = '{\n\t"app": "myApp"\n}{\n\t"app": "myApp2"\n}\n'
		const expected = [{ app: 'myApp' }, { app: 'myApp2' }]

		const output = await parseLogString(input)
		expect(output).toEqual(expected)
	})

	it('can parse quoted json', async () => {
		const input = '"{"app": "myApp"}"'
		const expected = [{ app: 'myApp' }]

		const output = await parseLogString(input)
		expect(output).toEqual(expected)
	})

	it('can parse quoted and csv escaped json', async () => {
		const input = '"{""app"": ""myApp""}"'
		const expected = [{ app: 'myApp' }]

		const output = await parseLogString(input)
		expect(output).toEqual(expected)
	})

	it('can parse unescaped message', async () => {
		const input = '{"app": "myApp", "message":""hello"","level": 1 }'
		const expected = [{ app: 'myApp', message: '"hello"', level: 1 }]

		const output = await parseLogString(input)
		expect(output).toEqual(expected)
	})
})
