<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\LogReader\Tests\Unit;

use OCA\LogReader\ConfigLexicon;
use OCA\LogReader\Constants;
use OCP\Config\Lexicon\Entry;
use OCP\Config\Lexicon\Preset;
use OCP\Config\ValueType;
use Test\TestCase;

class ConfigLexiconTest extends TestCase {
	public function testAppConfigsCoverAllAppConfigKeys(): void {
		$keys = array_map(fn (Entry $entry) => $entry->getKey(), (new ConfigLexicon())->getAppConfigs());

		// logLevel is a system value, not an app config value
		$expected = array_values(array_diff(Constants::CONFIG_KEYS, [Constants::CONFIG_KEY_LOGLEVEL]));
		$this->assertEqualsCanonicalizing($expected, $keys);
	}

	public function testAppConfigTypesAndDefaults(): void {
		$entries = [];
		foreach ((new ConfigLexicon())->getAppConfigs() as $entry) {
			$entries[$entry->getKey()] = [$entry->getValueType(), $entry->getDefault(Preset::NONE)];
		}

		$this->assertSame([
			Constants::CONFIG_KEY_SHOWNLEVELS => [ValueType::ARRAY, '[0,1,2,3,4]'],
			Constants::CONFIG_KEY_DATETIMEFORMAT => [ValueType::STRING, 'local'],
			Constants::CONFIG_KEY_RELATIVEDATES => [ValueType::BOOL, '0'],
			Constants::CONFIG_KEY_LIVELOG => [ValueType::BOOL, '1'],
		], $entries);
	}
}
