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

use OCA\LogReader\Log\LogIterator;
use OCA\LogReader\Log\SearchFilter;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\Http\TemplateResponse;

/**
 * Class LogController
 *
 * @package OCA\LogReader\Controller
 */
class LogController extends Controller {
	/**
	 * @param int $count
	 * @param int $offset
	 * @return TemplateResponse
	 */
	public function get($count = 50, $offset = 0) {
		$iterator = new LogIterator(fopen(\OC_Log_Owncloud::getLogFilePath(), 'rb'));
		return $this->responseFromIterator($iterator, $count, $offset);
	}

	/**
	 * @param string $query
	 * @param int $count
	 * @param int $offset
	 * @return TemplateResponse
	 */
	public function search($query = '', $count = 50, $offset = 0) {
		$iterator = new LogIterator(fopen(\OC_Log_Owncloud::getLogFilePath(), 'rb'));
		$iterator = new SearchFilter($iterator, $query);
		return $this->responseFromIterator($iterator, $count, $offset);
	}

	protected function responseFromIterator(\Iterator $iterator, $count, $offset) {
		for ($i = 0; $i < $offset; $i++) {
			$iterator->next();
		}
		$data = [];
		for ($i = 0; $i < $count; $i++) {
			$line = $iterator->current();
			if (!is_null($line)) {
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
