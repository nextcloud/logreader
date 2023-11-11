<?php

declare(strict_types=1);

/**
 * @copyright Copyright (c) 2018 Arthur Schiwon <blizzz@arthur-schiwon.de>
 *
 * @author Arthur Schiwon <blizzz@arthur-schiwon.de>
 * @author Christoph Wurst <christoph@winzerhof-wurst.at>
 * @author Roeland Jago Douma <roeland@famdouma.nl>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
namespace OCA\LogReader\BackgroundJobs;

use OCP\AppFramework\Utility\ITimeFactory;
use OCP\BackgroundJob\TimedJob;
use OCP\Files\IAppData;
use OCP\Files\NotFoundException;
use OCP\IConfig;

class Rotate extends TimedJob {

	public function __construct(
		ITimeFactory $time,
		private IConfig $config,
		private IAppData $appData,
	) {
		parent::__construct($time);

		$this->setInterval(60 * 60 * 3);
	}

	protected function run($argument): void {
		try {
			$folder = $this->appData->getFolder('logreader');
			$file = $folder->getFile('nextcloud.log');
		} catch (NotFoundException $e) {
			// Nothing to do if there is no log
			return;
		}

		$maxSize = $this->config->getSystemValue('log_rotate_size', 100 * 1024 * 1024);
		if ($file->getSize() < $maxSize) {
			// nothing to do
			return;
		}

		if ($folder->fileExists('nextcloud.1.log')) {
			$rotatedFile = $folder->getFile('nextcloud.1.log');
		} else {
			$rotatedFile = $folder->newFile('nextcloud.1.log');
		}
		$rotatedFile->putContent($file->getContent());
		$file->putContent('');
	}
}
