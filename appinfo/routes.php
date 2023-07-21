<?php
/**
 * Copyright (c) 2015 Robin Appelman <icewind@owncloud.com>
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the COPYING-README file.
 */

/** @var $this OC\Route\Router */

return ['routes' => [
	// page
	['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
	['name' => 'log#get', 'url' => '/api/log', 'verb' => 'GET'],
	['name' => 'log#poll', 'url' => '/api/poll', 'verb' => 'GET'],
	// app settings
	['name' => 'settings#getAppConfig', 'url' => '/api/settings', 'verb' => 'GET'],
	['name' => 'settings#updateAppConfig', 'url' => '/api/settings', 'verb' => 'PUT']
]];
