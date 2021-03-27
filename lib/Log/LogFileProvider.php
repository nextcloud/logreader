<?php declare(strict_types=1);
/**
 * @copyright Copyright (c) 2021 Abijeet Patro <abijeetpatro@gmail.com>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
namespace OCA\LogReader\Log;

use OCP\App\IAppManager;
use OCP\IConfig;
use OCP\Log\IFileBased;
use OCP\Log\ILogFactory;

class LogFileProvider {
	private $config;
	private $logFactory;
	private $appManager;
	/** @var string[] */
	private $availableLogFiles;

	public const DEFAULT_LOG_ID = 'nextcloud';

	public function __construct(IConfig $config, ILogFactory $logFactory, IAppManager $appManager) {
		$this->config = $config;
		$this->logFactory = $logFactory;
		$this->appManager = $appManager;
		$this->availableLogFiles = [];
	}

	/** @return string[] */
	public function getAvailableLogFiles(): array {
		if ($this->availableLogFiles) {
			return $this->availableLogFiles;
		}

		$this->availableLogFiles[self::DEFAULT_LOG_ID] = $this->getDefaultLogFilePath();

		if ($this->appManager->isEnabledForUser('admin_audit')) {
			$this->availableLogFiles['admin_audit'] = $this->config->getAppValue(
				'admin_audit',
				'logfile',
				$this->config->getSystemValue('datadirectory', \OC::$SERVERROOT . '/data') . '/audit.log'
			);
		}

		return $this->availableLogFiles;
	}

	public function getLogFilePathById(string $logIdentifier): ?string {
		$availableLogFiles = $this->getAvailableLogFiles();
		return $availableLogFiles[$logIdentifier] ?? null;
	}

	public function getDefaultLogFilePath(): string {
		$log = $this->logFactory->get('file');
		if ($log instanceof IFileBased) {
			return $log->getLogFilePath();
		}

		throw new \Exception('Can\'t find log class');
	}
}
