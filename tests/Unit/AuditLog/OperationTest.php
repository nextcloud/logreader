<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\LogReader\Tests\Unit\AuditLog;

use OCA\LogReader\AuditLog\Operation;
use Test\TestCase;

class OperationTest extends TestCase {
	public function testCases(): void {
		foreach (Operation::cases() as $operation) {
			$this->assertMatchesRegularExpression('/^logreader\.[a-z][a-z0-9_]*\.[a-z][a-z0-9_]*$/', $operation->value);
			$this->assertNotSame('', $operation->description());
		}
	}
}
