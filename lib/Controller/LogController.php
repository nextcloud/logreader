<?php
/**
 * @author Robin Appelman <icewind@owncloud.com>
 * @author Ferdinand Thiessen <opensource@fthiessen.de>
 *
 * @copyright Copyright (c) 2015, ownCloud, Inc.
 * @license AGPL-3.0
 *
 * This code is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License, version 3,
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 *
 */

namespace OCA\LogReader\Controller;

use OCA\LogReader\Log\LogIteratorFactory;
use OCA\LogReader\Log\SearchFilter;
use OCA\LogReader\Service\SettingsService;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\JSONResponse;
use OCP\IRequest;

/**
 * Class LogController
 *
 * @package OCA\LogReader\Controller
 */
class LogController extends Controller {
	private LogIteratorFactory $logIteratorFactory;
	private SettingsService $settings;

	public function __construct($appName,
		IRequest $request,
		LogIteratorFactory $logIteratorFactory,
		SettingsService $settingsService
	) {
		parent::__construct($appName, $request);
		$this->logIteratorFactory = $logIteratorFactory;
		$this->settings = $settingsService;
	}

	/**
	 * @AuthorizedAdminSetting(settings=OCA\LogReader\Settings\Admin)
	 * @param int $count
	 * @param int $offset
	 * @param string $levels
	 * @return JSONResponse
	 */
	public function get($count = 50, $offset = 0, $levels = '11111'): JSONResponse {
		$logType = $this->settings->getLoggingType();
		if ($logType === 'file') { // we only support web access when `log_type` is set to `file` (the default)
			$iterator = $this->logIteratorFactory->getLogIterator($levels);
			return $this->responseFromIterator($iterator, $count, $offset);
		} else { // A log_type other than `file` seems to be configured so:
			//     * Generate a dummy entry so we don't error out
			//     * Use the dummy entry to inform the admin to look elsewhere and/or correct their configuration
			$dummyLine["id"] = uniqid();
			$dummyLine["reqid"] = "00000000000000000000"; // irrelevant
			$dummyLine["level"] = 4; // FATAL so it is always displayed
			$dummyLine["time"] = date(\DateTime::ATOM, time());
			$dummyLine["remoteAddr"] = "0.0.0.0";
			$dummyLine["user"] = "---";
			$dummyLine["app"] = "logreader";
			$dummyLine["method"] = "---";
			$dummyLine["url"] = "---";
			$dummyLine["message"] =
				'File-based logging must be enabled to access logs from the Web UI. Your `log_type` is currently '
				. 'set to: [' . $logType . ']. If you feel this is an error, please verify `log_type` in your '
				. 'config.php and check the Nextcloud Administration Manual. This is not an actual log entry.';
			$dummyLine["userAgent"] = "---";
			$dummyLine["version"] = "---";
			return new JSONResponse(['data' => $dummyLine, 'remain' => false]);
		}
	}


	/**
	 * @brief Gets the last item in the log, bypassing any cache.
	 * @return mixed
	 */
	private function getLastItem($levels) {
		$iterator = $this->logIteratorFactory->getLogIterator($levels);
		$iterator->next();
		return $iterator->current();
	}

	/**
	 * @AuthorizedAdminSetting(settings=OCA\LogReader\Settings\Admin)
	 * @brief polls for a new log message since $lastReqId.
	 * This method will sleep for maximum 20 seconds before returning an empty
	 * result.
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
	public function poll(string $lastReqId, string $levels = '11111'): JSONResponse {
		$cycles = 0;
		$maxCycles = 20;

		$logType = $this->settings->getLoggingType();
		if ($logType !== 'file') { // we only support access when `log_type` is set to `file` (the default)
			// TODO: Don't even attempt polling in the front-end
			sleep(20);
			return new JSONResponse([]);
		}
		$lastItem = $this->getLastItem($levels);
		while ($lastItem === null || $lastItem['reqId'] === $lastReqId) {
			sleep(1);
			$cycles++;
			if ($cycles === $maxCycles) {
				return new JSONResponse([]);
			}
			$lastItem = $this->getLastItem($levels);
		}
		$iterator = $this->logIteratorFactory->getLogIterator($levels);
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

	/**
	 * @AuthorizedAdminSetting(settings=OCA\LogReader\Settings\Admin)
	 * @param string $query
	 * @param int $count
	 * @param int $offset
	 * @param string $levels
	 * @return JSONResponse
	 *
	 * @NoCSRFRequired
	 */
	public function search($query = '', $count = 50, $offset = 0, $levels = '11111'): JSONResponse {
		$iterator = $this->logIteratorFactory->getLogIterator($levels);
		$iterator = new \LimitIterator($iterator, 0, 100000); // limit the number of message we search to avoid huge search times
		$iterator->rewind();
		$iterator = new SearchFilter($iterator, $query);
		$iterator->rewind();
		return $this->responseFromIterator($iterator, $count, $offset);
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
				$line["id"] = uniqid();
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
