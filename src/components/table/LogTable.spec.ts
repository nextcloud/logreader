/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ILogEntry } from '../../interfaces'

import { createTestingPinia } from '@pinia/testing'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import LogTable from './LogTable.vue'
import { useLogStore } from '../../store/logging'

/** Browser IntersectionObserver fake: reports visibility on observe() and on every change of it */
class FakeIntersectionObserver {
	static visible = true
	static instances = new Set<FakeIntersectionObserver>()

	static setVisible(visible: boolean) {
		if (this.visible !== visible) {
			this.visible = visible
			this.instances.forEach((observer) => observer.notify())
		}
	}

	constructor(private callback: IntersectionObserverCallback) {}

	observe() {
		FakeIntersectionObserver.instances.add(this)
		this.notify()
	}

	disconnect() {
		FakeIntersectionObserver.instances.delete(this)
	}

	private notify() {
		this.callback([{ isIntersecting: FakeIntersectionObserver.visible } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
	}
}

function mountLogTable() {
	return mount(LogTable, {
		props: { rows: [] },
		global: {
			plugins: [createTestingPinia({ createSpy: vi.fn, initialState: { 'logreader-settings': { shownLevels: [0, 1, 2, 3, 4] } } })],
			stubs: {
				LogDetailsModal: true,
				LogSearch: true,
				LogTableHeader: true,
				LogTableRow: true,
			},
		},
	})
}

enableAutoUnmount(afterEach)

describe('LogTable', () => {
	beforeEach(() => {
		// The table starts empty, so the load-more row is visible
		FakeIntersectionObserver.visible = true
		FakeIntersectionObserver.instances.clear()
		vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
	})

	it('loads more entries when the table is mounted', () => {
		mountLogTable()
		expect(useLogStore().loadMore).toHaveBeenCalledTimes(1)
	})

	it('does not load more entries when loaded entries push the load-more row out of view', async () => {
		mountLogTable()
		const logStore = useLogStore()

		FakeIntersectionObserver.setVisible(false)
		logStore.allEntries.push({ id: '1', level: 3 } as ILogEntry)
		await nextTick()
		expect(logStore.loadMore).toHaveBeenCalledTimes(1)
	})

	it('loads more entries when scrolling makes the load-more row visible again', async () => {
		mountLogTable()
		const logStore = useLogStore()
		FakeIntersectionObserver.setVisible(false)
		logStore.allEntries.push({ id: '1', level: 3 } as ILogEntry)
		await nextTick()

		FakeIntersectionObserver.setVisible(true)
		expect(logStore.loadMore).toHaveBeenCalledTimes(2)
	})

	it('loads more entries again when the load-more row stays visible after loading', async () => {
		mountLogTable()
		const logStore = useLogStore()

		logStore.allEntries.push({ id: '1', level: 3 } as ILogEntry)
		await nextTick()
		expect(logStore.loadMore).toHaveBeenCalledTimes(2)
	})
})
