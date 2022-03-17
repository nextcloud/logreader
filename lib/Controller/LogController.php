<?php
/**
 * @author Robin Appelman <icewind@owncloud.com>
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
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IConfig;
use OCP\IRequest;

/**
 * Class LogController
 *
 * @package OCA\LogReader\Controller
 */
class LogController extends Controller {
	private $logIteratorFactory;
	private $config;

	public function __construct($appName,
								IRequest $request,
								IConfig $config,
								LogIteratorFactory $logIteratorFactory
	) {
		parent::__construct($appName, $request);
		$this->logIteratorFactory = $logIteratorFactory;
		$this->config = $config;
	}

	/**
	 * @AuthorizedAdminSetting(settings=OCA\LogReader\Settings\Admin)
	 * @param int $count
	 * @param int $offset
	 * @param string $levels
	 * @return TemplateResponse
	 */
	public function get($count = 50, $offset = 0, $levels = '11111') {
		$iterator = $this->logIteratorFactory->getLogIterator($levels);
		return $this->responseFromIterator($iterator, $count, $offset);
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
	 * @return TemplateResponse
	 *
	 * @NoCSRFRequired
	 */
	public function search($query = '', $count = 50, $offset = 0, $levels = '11111') {
		$iterator = $this->logIteratorFactory->getLogIterator($levels);
		$iterator = new \LimitIterator($iterator, 0, 100000); // limit the number of message we search to avoid huge search times
		$iterator->rewind();
		$iterator = new SearchFilter($iterator, $query);
		$iterator->rewind();
		return $this->responseFromIterator($iterator, $count, $offset);
	}

	/**
	 * @AuthorizedAdminSetting(settings=OCA\LogReader\Settings\Admin)
	 */
	public function getLevels(): JSONResponse {
		return new JSONResponse($this->config->getAppValue('logreader', 'levels', '11111'));
	}

	/**
	 * @AuthorizedAdminSetting(settings=OCA\LogReader\Settings\Admin)
	 */
	public function getSettings(): JSONResponse {
		return new JSONResponse([
			'levels' => $this->config->getAppValue('logreader', 'levels', '11111'),
			'dateformat' => $this->config->getSystemValue('logdateformat', \DateTime::ISO8601),
			'timezone' => $this->config->getSystemValue('logtimezone', 'UTC'),
			'relativedates' => (bool)$this->config->getAppValue('logreader', 'relativedates', false),
			'live' => (bool)$this->config->getAppValue('logreader', 'live', true),
		]);
	}

	/**
	 * @AuthorizedAdminSetting(settings=OCA\LogReader\Settings\Admin)
	 * @param bool $relative
	 */
	public function setRelative($relative) {
		$this->config->setAppValue('logreader', 'relativedates', $relative);
	}

	/**
	 * @AuthorizedAdminSetting(settings=OCA\LogReader\Settings\Admin)
	 * @param bool $live
	 */
	public function setLive($live) {
		$this->config->setAppValue('logreader', 'live', $live);
	}

	/**
	 * @AuthorizedAdminSetting(settings=OCA\LogReader\Settings\Admin)
	 */
	public function setLevels(string $levels): int {
		$intLevels = array_map('intval', str_split($levels));
		$minLevel = 4;
		foreach ($intLevels as $level => $log) {
			if ($log) {
				$minLevel = $level;
				break;
			}
		}
		$this->config->setAppValue('logreader', 'levels', $levels);
		return $minLevel;
	}

	protected function responseFromIterator(\Iterator $iterator, $count, $offset) {
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
