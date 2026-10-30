<?php

declare(strict_types=1);

/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\LogReader\Tests\Unit\Migration;

use OCA\LogReader\Constants;
use OCA\LogReader\Migration\Version9000Date20261030000000;
use OCP\IAppConfig;
use OCP\Migration\IOutput;
use PHPUnit\Framework\Attributes\DataProvider;
use Test\TestCase;

class Version9000Date20261030000000Test extends TestCase {
	public static function dataPostSchemaChange(): array {
		return [
			'json encoded' => [true, '"utc"', 'utc'],
			'already plain' => [true, 'utc', null],
			'unset' => [false, null, null],
		];
	}

	#[DataProvider(methodName: 'dataPostSchemaChange')]
	public function testPostSchemaChange(bool $hasKey, ?string $stored, ?string $expected): void {
		$appConfig = $this->createMock(IAppConfig::class);
		$appConfig->method('hasKey')
			->with('logreader', Constants::CONFIG_KEY_DATETIMEFORMAT)
			->willReturn($hasKey);
		$appConfig->method('getValueString')
			->willReturn((string)$stored);

		if ($expected === null) {
			$appConfig->expects($this->never())->method('setValueString');
		} else {
			$appConfig->expects($this->once())
				->method('setValueString')
				->with('logreader', Constants::CONFIG_KEY_DATETIMEFORMAT, $expected);
		}

		(new Version9000Date20261030000000($appConfig))
			->postSchemaChange($this->createMock(IOutput::class), fn () => null, []);
	}
}
