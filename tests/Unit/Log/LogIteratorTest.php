<?php

/**
 * SPDX-FileCopyrightText: 2019 Robin Appelman <robin@icewind.nl>
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\LogReader\Tests\Unit\Log;

use OCA\LogReader\Log\LogIterator;
use PHPUnit\Framework\Attributes\DataProvider;
use Test\TestCase;

class LogIteratorTest extends TestCase {
	private function getLogHandle(string $data) {
		$handle = fopen('php://temp', 'r+');
		fwrite($handle, $data);
		rewind($handle);
		return $handle;
	}

	private function getLogIterator(string $log) {
		$handle = $this->getLogHandle($log);
		return new LogIterator($handle, \DateTime::ATOM, 'UTC');
	}

	private function getLogLine(string $reqId, int $length): string {
		$emptyLine = json_encode(['reqId' => $reqId, 'level' => 3, 'message' => '']);
		$line = json_encode(['reqId' => $reqId, 'level' => 3, 'message' => str_repeat('a', $length - strlen($emptyLine))]);
		$this->assertSame($length, strlen($line));
		return $line;
	}

	public static function trailingNewlineProvider(): array {
		return [
			'without trailing newline' => [''],
			'with trailing newline' => ["\n"],
		];
	}

	#[DataProvider(methodName: 'trailingNewlineProvider')]
	public function testGetLinesSpanningMultipleChunks(string $trailingNewline): void {
		// The first line starts at the beginning of the file. The last line and the trailing newline fill
		// exactly two chunks, so the newline in front of the last line is the last byte of the next chunk.
		$first = $this->getLogLine('1', 3 * LogIterator::CHUNK_SIZE + 17);
		$middle = $this->getLogLine('2', 100);
		$last = $this->getLogLine('3', 2 * LogIterator::CHUNK_SIZE - strlen($trailingNewline));
		$log = $this->getLogIterator($first . "\n" . $middle . "\n" . $last . $trailingNewline);

		$entries = iterator_to_array($log);

		$this->assertSame([
			json_decode($last, true),
			json_decode($middle, true),
			json_decode($first, true),
		], $entries);
	}

	public function testGetLines() {
		$log = $this->getLogIterator(
			'{"reqId":"1","level":3,"time":"2019-11-04T18:50:57+00:00","remoteAddr":"127.0.0.1","user":"admin","app":"comments","method":"GET","url":"/settings/admin/logging","message":{"Exception":"RuntimeException","Message":"App class OCA\\\\Comments\\\\AppInfo\\\\Application is not setup via query() but directly","Code":0,"Trace":[{"file":"/srv/http/cloud/apps/comments/lib/AppInfo/Application.php","line":42,"function":"__construct","class":"OCP\\\\AppFramework\\\\App","type":"->","args":["comments",[]]},{"file":"/srv/http/cloud/apps/comments/appinfo/app.php","line":24,"function":"__construct","class":"OCA\\\\Comments\\\\AppInfo\\\\Application","type":"->","args":[]},{"file":"/srv/http/cloud/lib/private/legacy/app.php","line":260,"args":["/srv/http/cloud/apps/comments/appinfo/app.php"],"function":"require_once"},{"file":"/srv/http/cloud/lib/private/legacy/app.php","line":154,"function":"requireAppFile","class":"OC_App","type":"::","args":["comments"]},{"file":"/srv/http/cloud/lib/private/legacy/app.php","line":127,"function":"loadApp","class":"OC_App","type":"::","args":["comments"]},{"file":"/srv/http/cloud/lib/base.php","line":991,"function":"loadApps","class":"OC_App","type":"::","args":[]},{"file":"/srv/http/cloud/index.php","line":42,"function":"handleRequest","class":"OC","type":"::","args":[]}],"File":"/srv/http/cloud/lib/public/AppFramework/App.php","Line":77,"CustomMessage":"--"},"userAgent":"Mozilla","version":"18.0.0.1"}
{"reqId":"2","level":3,"time":"2019-11-04T18:50:57+00:00","remoteAddr":"127.0.0.1","user":"admin","app":"gallery","method":"GET","url":"/settings/admin/logging","message":{"Exception":"RuntimeException","Message":"App class OCA\\\\Gallery\\\\AppInfo\\\\Application is not setup via query() but directly","Code":0,"Trace":[{"file":"/srv/http/cloud/apps/gallery/lib/AppInfo/Application.php","line":70,"function":"__construct","class":"OCP\\\\AppFramework\\\\App","type":"->","args":["gallery",[]]},{"file":"/srv/http/cloud/apps/gallery/appinfo/app.php","line":19,"function":"__construct","class":"OCA\\\\Gallery\\\\AppInfo\\\\Application","type":"->","args":[]},{"file":"/srv/http/cloud/lib/private/legacy/app.php","line":260,"args":["/srv/http/cloud/apps/gallery/appinfo/app.php"],"function":"require_once"},{"file":"/srv/http/cloud/lib/private/legacy/app.php","line":154,"function":"requireAppFile","class":"OC_App","type":"::","args":["gallery"]},{"file":"/srv/http/cloud/lib/private/legacy/app.php","line":127,"function":"loadApp","class":"OC_App","type":"::","args":["gallery"]},{"file":"/srv/http/cloud/lib/base.php","line":991,"function":"loadApps","class":"OC_App","type":"::","args":[]},{"file":"/srv/http/cloud/index.php","line":42,"function":"handleRequest","class":"OC","type":"::","args":[]}],"File":"/srv/http/cloud/lib/public/AppFramework/App.php","Line":77,"CustomMessage":"--"},"userAgent":"Mozilla","version":"18.0.0.1"}'
		);

		/** @var array[] $entries */
		$entries = iterator_to_array($log);

		$this->assertCount(2, $entries);

		// sorted last first
		$this->assertEquals(2, $entries[0]['reqId']);
		$this->assertEquals(1, $entries[1]['reqId']);
	}

	public function testGetLinesTrailingNewLine() {
		$log = $this->getLogIterator(
			'{"reqId":"1","level":3,"time":"2019-11-04T18:50:57+00:00","remoteAddr":"127.0.0.1","user":"admin","app":"comments","method":"GET","url":"/settings/admin/logging","message":{"Exception":"RuntimeException","Message":"App class OCA\\\\Comments\\\\AppInfo\\\\Application is not setup via query() but directly","Code":0,"Trace":[{"file":"/srv/http/cloud/apps/comments/lib/AppInfo/Application.php","line":42,"function":"__construct","class":"OCP\\\\AppFramework\\\\App","type":"->","args":["comments",[]]},{"file":"/srv/http/cloud/apps/comments/appinfo/app.php","line":24,"function":"__construct","class":"OCA\\\\Comments\\\\AppInfo\\\\Application","type":"->","args":[]},{"file":"/srv/http/cloud/lib/private/legacy/app.php","line":260,"args":["/srv/http/cloud/apps/comments/appinfo/app.php"],"function":"require_once"},{"file":"/srv/http/cloud/lib/private/legacy/app.php","line":154,"function":"requireAppFile","class":"OC_App","type":"::","args":["comments"]},{"file":"/srv/http/cloud/lib/private/legacy/app.php","line":127,"function":"loadApp","class":"OC_App","type":"::","args":["comments"]},{"file":"/srv/http/cloud/lib/base.php","line":991,"function":"loadApps","class":"OC_App","type":"::","args":[]},{"file":"/srv/http/cloud/index.php","line":42,"function":"handleRequest","class":"OC","type":"::","args":[]}],"File":"/srv/http/cloud/lib/public/AppFramework/App.php","Line":77,"CustomMessage":"--"},"userAgent":"Mozilla","version":"18.0.0.1"}
{"reqId":"2","level":3,"time":"2019-11-04T18:50:57+00:00","remoteAddr":"127.0.0.1","user":"admin","app":"gallery","method":"GET","url":"/settings/admin/logging","message":{"Exception":"RuntimeException","Message":"App class OCA\\\\Gallery\\\\AppInfo\\\\Application is not setup via query() but directly","Code":0,"Trace":[{"file":"/srv/http/cloud/apps/gallery/lib/AppInfo/Application.php","line":70,"function":"__construct","class":"OCP\\\\AppFramework\\\\App","type":"->","args":["gallery",[]]},{"file":"/srv/http/cloud/apps/gallery/appinfo/app.php","line":19,"function":"__construct","class":"OCA\\\\Gallery\\\\AppInfo\\\\Application","type":"->","args":[]},{"file":"/srv/http/cloud/lib/private/legacy/app.php","line":260,"args":["/srv/http/cloud/apps/gallery/appinfo/app.php"],"function":"require_once"},{"file":"/srv/http/cloud/lib/private/legacy/app.php","line":154,"function":"requireAppFile","class":"OC_App","type":"::","args":["gallery"]},{"file":"/srv/http/cloud/lib/private/legacy/app.php","line":127,"function":"loadApp","class":"OC_App","type":"::","args":["gallery"]},{"file":"/srv/http/cloud/lib/base.php","line":991,"function":"loadApps","class":"OC_App","type":"::","args":[]},{"file":"/srv/http/cloud/index.php","line":42,"function":"handleRequest","class":"OC","type":"::","args":[]}],"File":"/srv/http/cloud/lib/public/AppFramework/App.php","Line":77,"CustomMessage":"--"},"userAgent":"Mozilla","version":"18.0.0.1"}
'
		);

		/** @var array[] $entries */
		$entries = iterator_to_array($log);

		$this->assertCount(2, $entries);

		// sorted last first
		$this->assertEquals(2, $entries[0]['reqId']);
		$this->assertEquals(1, $entries[1]['reqId']);
	}
}
