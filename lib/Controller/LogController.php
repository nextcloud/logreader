<?php

/**
 * SPDX-FileCopyrightText: 2016-2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-FileCopyrightText: 2015 ownCloud, Inc.
 * SPDX-License-Identifier: AGPL-3.0-only
 */

namespace OCA\LogReader\Controller;

use OCA\LogReader\Log\LogIteratorFactory;
use OCA\LogReader\Log\SearchFilter;
use OCA\LogReader\Service\SettingsService;
use OCA\LogReader\Settings\Admin;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\AuthorizedAdminSetting;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\Http\StreamTraversableResponse;
use OCP\IRequest;
use Psr\Log\LoggerInterface;

/**
 * Class LogController
 *
 * @package OCA\LogReader\Controller
 * @psalm-api
 */
class LogController extends Controller {
	/** Maximum number of entries of the shown levels a search or a poll goes through, hidden ones are not counted */
	private const MAX_SCANNED_ENTRIES = 100000;

	public function __construct(
		$appName,
		IRequest $request,
		private LogIteratorFactory $logIteratorFactory,
		private SettingsService $settingsService,
		private LoggerInterface $logger,
	) {
		parent::__construct($appName, $request);
	}

	/**
	 * @param string $query
	 * @param int $count
	 * @param int $offset
	 */
	#[AuthorizedAdminSetting(settings: Admin::class)]
	public function get($query = '', $count = 50, $offset = 0): JSONResponse|StreamTraversableResponse {
		$logType = $this->settingsService->getLoggingType();
		// we only support web access when `log_type` is set to `file` (the default)
		if ($logType !== 'file') {
			$this->logger->debug('File-based logging must be enabled to access logs from the Web UI.');
			return new JSONResponse([], Http::STATUS_FAILED_DEPENDENCY);
		}

		$iterator = $this->logIteratorFactory->getLogIterator($this->settingsService->getShownLevels());

		if ($query !== '') {
			$iterator = new SearchFilter(new \LimitIterator($iterator, 0, self::MAX_SCANNED_ENTRIES), $query);
		}

		return $this->responseFromIterator($iterator, $count, $offset);
	}

	/**
	 * @brief Use to poll for new log messages since $lastReqId.
	 *
	 * @note There is a possible race condition, when the user loads the
	 * logging page when a request isn't finished and this specific request
	 * is the last request in the log, then new messages of this request
	 * won't be polled. This is because there is no reliable way to identify
	 * a log message, so we have to use the reqid:
	 *  - the key of the iterator will change when a new message is saved
	 *  - a combination of reqid and counting the messages for that specific reqid
	 *  will work in some cases but not when there are more than 50 messages of that
	 *  request.
	 */
	#[AuthorizedAdminSetting(settings: Admin::class)]
	public function poll(string $lastReqId): JSONResponse|StreamTraversableResponse {
		$logType = $this->settingsService->getLoggingType();
		// we only support web access when `log_type` is set to `file` (the default)
		if ($logType !== 'file') {
			$this->logger->debug('File-based logging must be enabled to access logs from the Web UI.');
			return new JSONResponse([], Http::STATUS_FAILED_DEPENDENCY);
		}

		$iterator = $this->logIteratorFactory->getLogIterator($this->settingsService->getShownLevels());
		$iterator->rewind();

		return $this->streamJson($this->encodeEntriesNewerThan($iterator, $lastReqId));
	}

	protected function responseFromIterator(\Iterator $iterator, int $count, int $offset): StreamTraversableResponse {
		$iterator->rewind();
		for ($i = 0; $i < $offset && $iterator->valid(); $i++) {
			$iterator->next();
		}
		return $this->streamJson($this->encodePage($iterator, $count));
	}

	/**
	 * @return \Generator<string>
	 */
	private function encodeEntriesNewerThan(\Iterator $iterator, string $lastReqId): \Generator {
		yield '[';
		yield from $this->encodeEntries($this->takeEntriesNewerThan($iterator, $lastReqId));
		yield ']';
	}

	/**
	 * @return \Generator<string>
	 */
	private function encodePage(\Iterator $iterator, int $count): \Generator {
		yield '{"data":[';
		yield from $this->encodeEntries($this->takeEntries($iterator, $count));
		yield '],"remain":' . ($iterator->valid() ? 'true' : 'false') . '}';
	}

	/**
	 * One part per entry, so only a single entry is held in memory at a time
	 *
	 * @param iterable<array> $entries
	 * @return \Generator<string>
	 */
	private function encodeEntries(iterable $entries): \Generator {
		$separator = '';
		foreach ($entries as $entry) {
			$entry['id'] = uniqid();
			yield $separator . $this->encodeJson($entry);
			$separator = ',';
		}
	}

	/**
	 * Leaves the iterator behind the last taken entry, so its valid() tells whether entries remain
	 *
	 * @return \Generator<array>
	 */
	private function takeEntries(\Iterator $iterator, int $count): \Generator {
		for ($i = 0; $i < $count && $iterator->valid(); $i++) {
			yield $iterator->current();
			$iterator->next();
		}
	}

	/**
	 * @return \Generator<array>
	 */
	private function takeEntriesNewerThan(\Iterator $iterator, string $lastReqId): \Generator {
		foreach ($this->takeEntries($iterator, self::MAX_SCANNED_ENTRIES) as $entry) {
			if (($entry['reqId'] ?? null) === $lastReqId) {
				return;
			}
			yield $entry;
		}
	}

	/**
	 * @param \Generator<string> $json
	 */
	private function streamJson(\Generator $json): StreamTraversableResponse {
		return new StreamTraversableResponse($json, Http::STATUS_OK, ['Content-Type' => 'application/json; charset=utf-8']);
	}

	/**
	 * Like JSONResponse::render(), but never fails and replaces values JSON cannot represent (e.g. INF), as the
	 * response is already being sent and skipping the entry would shift the offsets of the next pages
	 *
	 * @psalm-suppress FalsableReturnStatement, InvalidFalsableReturnType
	 */
	private function encodeJson(mixed $data): string {
		return json_encode($data, JSON_HEX_TAG | JSON_PARTIAL_OUTPUT_ON_ERROR, 2048);
	}
}
