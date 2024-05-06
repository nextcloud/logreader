/**
 * SPDX-FileCopyrightText: 2023 Ferdinand Thiessen <opensource@fthiessen.de>
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { getLoggerBuilder } from '@nextcloud/logger'

export const logger = getLoggerBuilder().setApp(appName).build()
