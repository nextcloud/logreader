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
use OCP\IRequest;
use Psr\Log\LoggerInterface;

/**
 * Class LogController
 *
 * @package OCA\LogReader\Controller
 */
class LogController extends Controller {

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
	 * @return JSONResponse
	 */
	#[AuthorizedAdminSetting(settings: Admin::class)]
	public function get($query = '', $count = 50, $offset = 0): JSONResponse {
		$logType = $this->settingsService->getLoggingType();
		// we only support web access when `log_type` is set to `file` (the default)
		if ($logType !== 'file') {
			$this->logger->debug('File-based logging must be enabled to access logs from the Web UI.');
			return new JSONResponse([], Http::STATUS_FAILED_DEPENDENCY);
		}

		$iterator = $this->logIteratorFactory->getLogIterator($this->settingsService->getShownLevels());

		if ($query !== '') {
			$iterator = new \LimitIterator($iterator, 0, 100000); // limit the number of message we search to avoid huge search times
			$iterator->rewind();
			$iterator = new SearchFilter($iterator, $query);
			$iterator->rewind();
			return $this->responseFromIterator($iterator, $count, $offset);
		}

		return $this->responseFromIterator($iterator, $count, $offset);
	}

	/**
	 * @brief Gets the last item in the log, bypassing any cache.
	 * @return mixed
	 */
	private function getLastItem() {
		$iterator = $this->logIteratorFactory->getLogIterator($this->settingsService->getShownLevels());
		$iterator->next();
		return $iterator->current();
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
	public function poll(string $lastReqId): JSONResponse {
		$logType = $this->settingsService->getLoggingType();
		// we only support web access when `log_type` is set to `file` (the default)
		if ($logType !== 'file') {
			$this->logger->debug('File-based logging must be enabled to access logs from the Web UI.');
			return new JSONResponse([], Http::STATUS_FAILED_DEPENDENCY);
		}

		$lastItem = $this->getLastItem();
		if ($lastItem === null || $lastItem['reqId'] === $lastReqId) {
			return new JSONResponse([]);
		}

		$iterator = $this->logIteratorFactory->getLogIterator($this->settingsService->getShownLevels());
		$iterator->next();

		$data = [];

		while ($iterator->valid()) {
			$line = $iterator->current();

			if ($line['reqId'] === $lastReqId) {
				break;
			}

			if (!is_null($line)) {
				$line['id'] = uniqid();
				$data[] = $line;
			}
			$iterator->next();
		}

		return new JSONResponse($data);
	}

	protected function responseFromIterator(\Iterator $iterator, $count, $offset): JSONResponse {
		$iterator->rewind();
		for ($i = 0; $i < $offset; $i++) {
			$iterator->next();
		}
		$data = [];
		for ($i = 0; $i < $count && $iterator->valid(); $i++) {
			$line = $iterator->current();
			if (!is_null($line)) {
				$line['id'] = uniqid();
				$data[] = $line;
			}
			$iterator->next();
		}
		return new JSONResponse([
			'data' => $data,
			'remain' => $iterator->valid()
		]);
	}
}
