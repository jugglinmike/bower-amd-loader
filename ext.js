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
		var packagesDir = manager.dir;
		var root;

		if (config && config.paths && config.paths[packagesDir]) {
			packagesDir = config.paths[packagesDir];
		}

		root = packagesDir + '/' + packageName;
		getJSON(root + '/' + manager.configFile, function(meta) {
			var path = root + '/' + meta.main;
			var map;

			// Make map config
			//var map = config.map[name] = config.map[name + '_unnormalized2'] = {};
			if (!config.map) {
				config.map = {};
			}

			if (!config.map['*']) {
				config.map['*'] = {};
			}

			// TODO: Namespace dynamically-created paths to the current module
			// ID. (This doesn't work at the moment, for some reason.)
			//map = config.map[name] = {};
			map = config.map['*'];

			if (meta.dependencies) {
				Object.keys(meta.dependencies).forEach(function(key) {
					map[key] = 'ext!' + parts[0] + '?' + key;
				});
			}

			config.map['*'][name] = path;

			req([name], function(val) {
				// TODO: Do not rely on RequireJS internals.
				var p = require.s.contexts._.registry[packageName];
				if (p && p.factory) {
					val = p.factory.call(null);
				}
				onload(val);
			});
		});
	}
});

}());
