<?php

$c = \OC::$server;

$user = \OC::$server->getUserSession()->getUser();
if ($user and \OC::$server->getGroupManager()->isAdmin($user->getUID()) and !interface_exists('\OCP\Settings\ISettings')) {
	\OC::$server->getNavigationManager()->add(function () {
		return [
			'id' => 'logreader',
			'order' => 22,
			'name' => 'Log reader',
			'href' => \OC::$server->getURLGenerator()->linkToRoute('logreader.page.index'),
			'icon' => \OC::$server->getURLGenerator()->imagePath('logreader', 'app.svg'),//TODO
		];
	});
}
