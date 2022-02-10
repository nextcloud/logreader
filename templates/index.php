<?php

\OCP\Util::addScript('logreader', 'logreader-main');
\OCP\Util::addStyle('logreader', '../js/logreader-main');
?>
<div id="searchresults" style="display: none"></div>
<div id="logreader-root" data-inline-settings="<?php echo $_['inline-settings'];?>"/>
