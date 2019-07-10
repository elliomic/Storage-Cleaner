/*
  Copyright (c) 2014 All rights reserved.
  Use of this source code is governed by the GNU General Public License version 3.0
  that can be found at gnu.org/licenses/gpl-3.0.txt
*/

var keys = ["appcache", "cache", "cookies", "downloads", "fileSystems", "formData", "history", "indexedDB", "localStorage", "serverBoundCertificates", "passwords", "pluginData", "webSQL"];

function forEach(list, callback) {
	for(var i=0; i<list.length; i++) {
		callback(list[i]);
	}
}

function checkboxMap(callback) {
	forEach(keys, function(key) {
		var boxes = document.getElementsByName(key);
		forEach(boxes, function(box) {
			callback(key, box);
		});
	});
}

function getOptions() {
	var options = JSON.parse(localStorage.getItem("options"));
	if(options == null) {
		options = {};
		forEach(keys, function(key) {
			options[key] = false;
		});
	}
	return options;
}

function clean(options) {
	checkboxMap(function(key, box) {
		options[key] = box.checked;
	});
	chrome.browsingData.remove({"since": 0}, options, function() {});
	localStorage.setItem("options", JSON.stringify(options));
	self.close();
}

document.addEventListener('DOMContentLoaded', function() {
	var options = getOptions();
	checkboxMap(function(key, box) {
		box.checked = options[key];
		box.addEventListener("click", function(box) {
			box.checked = !box.checked;
		});
	});
	document.getElementById("cleanButton").addEventListener("click", function() {
		clean(options)
	});
});
