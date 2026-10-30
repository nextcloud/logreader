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
use OCP\Config\ValueType;
use Test\TestCase;

class ConfigLexiconTest extends TestCase {
	public function testAppConfigsCoverAllAppConfigKeys(): void {
		$keys = array_map(fn (Entry $entry) => $entry->getKey(), (new ConfigLexicon())->getAppConfigs());

		// logLevel is a system value, not an app config value
		$expected = array_values(array_diff(Constants::CONFIG_KEYS, [Constants::CONFIG_KEY_LOGLEVEL]));
		$this->assertEqualsCanonicalizing($expected, $keys);
	}

	public function testAppConfigTypes(): void {
		$types = [];
		foreach ((new ConfigLexicon())->getAppConfigs() as $entry) {
			$types[$entry->getKey()] = $entry->getValueType();
		}

		$this->assertSame([
			Constants::CONFIG_KEY_SHOWNLEVELS => ValueType::ARRAY,
			Constants::CONFIG_KEY_DATETIMEFORMAT => ValueType::STRING,
			Constants::CONFIG_KEY_RELATIVEDATES => ValueType::BOOL,
			Constants::CONFIG_KEY_LIVELOG => ValueType::BOOL,
		], $types);
	}
}
