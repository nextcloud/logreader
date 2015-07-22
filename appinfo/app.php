<?php

$c = \OC::$server;

\OC::$server->getNavigationManager()->add(function () {
	return [
		'id' => 'logreader',
		'order' => 22,
		'name' => 'Log reader',
		'href' => \OC::$server->getURLGenerator()->linkToRoute('logreader.page.index'),
		'icon' => \OC::$server->getURLGenerator()->imagePath('audios', 'app.svg'),//TODO
	];
});
