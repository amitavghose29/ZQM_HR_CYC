/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comairbus/zqm_hr_cyc/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
