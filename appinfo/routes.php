<?php

/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-FileCopyrightText: 2015 ownCloud, Inc.
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
return ['routes' => [
	// page
	['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
	['name' => 'log#get', 'url' => '/api/log', 'verb' => 'GET'],
	['name' => 'log#poll', 'url' => '/api/poll', 'verb' => 'GET'],
	// app settings
	['name' => 'settings#getAppConfig', 'url' => '/api/settings', 'verb' => 'GET'],
	['name' => 'settings#updateAppConfig', 'url' => '/api/settings', 'verb' => 'PUT']
]];
