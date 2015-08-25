<?php

$c = \OC::$server;

$user = \OC::$server->getUserSession()->getUser();
if (\OC::$server->getGroupManager()->isAdmin($user->getUID())) {
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
