import type { AppSettings, LogEntry } from './types'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

import { generateUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'

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
    data: readonly LogEntry[]
    /** True if more entries are available */
    remain: boolean
}

interface ApiSetAppSetting {
    settingsKey: string
    settingsValue: any
}

type ApiGetAppSettings = never

/**
 * Fetch log entries from server
 *
 * @param data Parameters for request
 * @param config Axios config for setting data
 * @return Array of fetched log entries
 * @throws AxiosError with HTTP status 424 if log type is not set to `file`
 */
export const getLog = (data: ApiGetLog, config: AxiosRequestConfig<ApiGetLog> = {}) => axios.get<ApiLogResult, AxiosResponse<ApiLogResult, ApiGetLog>>(generateUrl('apps/logreader/api/log'), { ...config, data }) as Promise<AxiosResponse<ApiLogResult>>

/**
 * Fetch log entries from server
 *
 * @param data Parameters for request
 * @param config Axios config for setting data
 * @return Array of fetched log entries
 * @throws AxiosError with HTTP status 424 if log type is not set to `file`
 */
export const pollLog = (data: ApiPollLog, config: AxiosRequestConfig<ApiPollLog> = {}) => axios.get<ApiLogResult, AxiosResponse<ApiLogResult, ApiPollLog>>(generateUrl('apps/logreader/api/log'), { ...config, data }) as Promise<AxiosResponse<ApiLogResult>>

/**
 * Change an app setting value
 *
 * @param data Parameters for request
 * @param config Axios config for setting data
 * @return
 */
export const setAppSetting = (data: ApiSetAppSetting, config: AxiosRequestConfig<ApiSetAppSetting> = {}) => axios.put<void, AxiosResponse<void, ApiSetAppSetting>>(generateUrl('apps/logreader/api/settings'), { ...config, data })

/**
 * Get current app settings
 *
 * @param data Request parameters
 * @param config Optional Axios request config
 * @return The current app config
 */
export const getAppSettings = (data: ApiGetAppSettings, config: AxiosRequestConfig<ApiGetAppSettings> = {}) => axios.get<AppSettings, AxiosResponse<void, ApiGetAppSettings>>(generateUrl('apps/logreader/api/settings'), { ...config, data })
