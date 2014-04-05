(function() {
'use strict';

// TODO: Support custom installation directories, as in:
// http://bower.io/#custom-install-directory
// http://jamjs.org/docs

var getJSON = function(url, done) {
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			done(JSON.parse(xhr.responseText));
		}
	};

	xhr.open("GET", url, true);
	xhr.send(null);
};

var managers = {
	bower: {
		dir: 'bower_components',
		configFile: 'bower.json'
	},
	npm: {
		dir: 'node_modules',
		configFile: 'package.json',
		dflt: 'index'
	}
};

define({
	load: function(name, req, onload, config) {
		var parts = name.split('?');
		var manager = managers[parts[0]];
		var packageName = parts[1];
		var packageDir = manager.dir;
		var root;
		console.log(packageName);

		if (config && config.paths && config.paths[packageDir]) {
			packageDir = config.paths[packageDir];
		}

		root = packageDir + '/' + packageName;
		getJSON(root + '/' + manager.configFile, function(meta) {
			req([root + '/' + meta.main], onload);
		});
	}
});

}());
