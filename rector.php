<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

use Nextcloud\Rector\Rector\ReplaceInjectedMethodCallRector;
use Nextcloud\Rector\Set\NextcloudSets;
use Rector\Config\RectorConfig;

return RectorConfig::configure()
	->withPaths([
		__DIR__ . '/appinfo',
		__DIR__ . '/lib',
		__DIR__ . '/templates',
		__DIR__ . '/tests/Unit',
	])
	->withPhpSets(php83: true)
	->withSets([
		NextcloudSets::NEXTCLOUD_35,
	])
	->withSkip([
		// Rewrites to untyped IAppConfig::getValue()/setValue(); OCP only has typed getters/setters, so the type must be picked per call site
		ReplaceInjectedMethodCallRector::class,
	])
	->withTypeCoverageLevel(0);
