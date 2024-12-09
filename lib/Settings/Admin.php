<?php

/**
 * SPDX-FileCopyrightText: 2016 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\LogReader\Settings;

use OCA\LogReader\Service\SettingsService;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Services\IInitialState;
use OCP\Settings\IDelegatedSettings;
use OCP\Util;

class Admin implements IDelegatedSettings {

	public function __construct(
		private string $appName,
		private IInitialState $initialState,
		private SettingsService $settingsService,
	) {
	}

	/**
	 * @return TemplateResponse
	 */
	public function getForm() {
		Util::addScript($this->appName, 'logreader-main');
		Util::addStyle($this->appName, 'logreader-main');

		$this->initialState->provideInitialState('settings', $this->settingsService->getAppSettings());

		return new TemplateResponse($this->appName, 'index');
	}

	/**
	 * @return string the section ID, e.g. 'sharing'
	 */
	public function getSection() {
		return 'logging';
	}

	/**
	 * @return int whether the form should be rather on the top or bottom of
	 *             the admin section. The forms are arranged in ascending order of the
	 *             priority values. It is required to return a value between 0 and 100.
	 *
	 * E.g.: 70
	 */
	public function getPriority() {
		return 90;
	}

	public function getName(): ?string {
		return null;
	}

	public function getAuthorizedAppConfig(): array {
		return [];
	}
}
