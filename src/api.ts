/**
 * SPDX-FileCopyrightText: 2023 Nextcloud Gmbh and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { AxiosError, AxiosRequestConfig, AxiosResponse } from '@nextcloud/axios'
import type { IAppSettings, INextcloud22LogEntry } from './interfaces'

import axios from '@nextcloud/axios'
import { generateUrl } from '@nextcloud/router'

interface ApiGetLog {
	offset?: number
	count?: number
	query?: string
}

interface ApiPollLog {
	lastReqId: string
}

interface ApiLogResult {
	/** New entries */
	data: readonly INextcloud22LogEntry[]
	/** True if more entries are available */
	remain: boolean
}

type ApiPollLogResult = readonly INextcloud22LogEntry[]

type IAppSettingsKey = keyof IAppSettings

interface ApiSetAppSetting<I extends IAppSettingsKey> {
	settingsKey: I
	settingsValue: IAppSettings[I]
}

type ApiGetAppSettings = never

/**
 * Fetch log entries from server
 *
 * @param data Parameters for request
 * @param config Axios config for setting data
 * @return Array of fetched log entries
 * @throws {AxiosError} with HTTP status 424 if log type is not set to `file`
 */
export const getLog = (data: ApiGetLog, config: AxiosRequestConfig<ApiGetLog> = {}) => axios.get<ApiLogResult, AxiosResponse<ApiLogResult, ApiGetLog>>(generateUrl('apps/logreader/api/log'), { ...config, params: data }) as Promise<AxiosResponse<ApiLogResult>>

/**
 * Fetch log entries from server
 *
 * @param data Parameters for request
 * @param config Axios config for setting data
 * @return Array of fetched log entries
 * @throws {AxiosError} with HTTP status 424 if log type is not set to `file`
 */
export const pollLog = (data: ApiPollLog, config: AxiosRequestConfig<ApiPollLog> = {}) => axios.get<ApiPollLogResult, AxiosResponse<ApiPollLogResult, ApiPollLog>>(generateUrl('apps/logreader/api/poll'), { ...config, params: data }) as Promise<AxiosResponse<ApiPollLogResult>>

/**
 * Change an app setting value
 *
 * @param data Parameters for request
 * @param config Axios config for setting data
 * @return
 */
export const setAppSetting = <K extends IAppSettingsKey>(data: ApiSetAppSetting<K>, config: AxiosRequestConfig<ApiSetAppSetting<K>> = {}) => axios.put<void, AxiosResponse<void, ApiSetAppSetting<K>>>(generateUrl('apps/logreader/api/settings'), data, config)

/**
 * Get current app settings
 *
 * @param data Request parameters
 * @param config Optional Axios request config
 * @return The current app config
 */
export const getAppSettings = (data?: ApiGetAppSettings, config: AxiosRequestConfig<ApiGetAppSettings> = {}) => axios.get<IAppSettings, AxiosResponse<IAppSettings, ApiGetAppSettings>>(generateUrl('apps/logreader/api/settings'), { ...config, params: data })
