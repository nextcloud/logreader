<?php

/**
 * SPDX-FileCopyrightText: 2016-2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-FileCopyrightText: 2015 ownCloud, Inc.
 * SPDX-License-Identifier: AGPL-3.0-only
 */

namespace OCA\LogReader\Controller;

use OCA\LogReader\Service\SettingsService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Services\IInitialState;
use OCP\Util;

/**
 * Class PageController
 *
 * @package OCA\LogReader\Controller
 * @psalm-api
 */
class PageController extends Controller {

	public function __construct(
		private readonly IInitialState $initialState,
		private readonly SettingsService $settingsService,
	) {
	}

	/**
	 * @return TemplateResponse
	 */
	#[\OCP\AppFramework\Http\Attribute\NoCSRFRequired]
	public function index() {
		Util::addScript($this->appName, 'logreader-main');
		Util::addStyle($this->appName, 'logreader-main');
		$this->initialState->provideInitialState('settings', $this->settingsService->getAppSettings());

		return new TemplateResponse($this->appName, 'index');
	}
}
