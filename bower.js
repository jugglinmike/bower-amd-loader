(function() {
'use strict';

var getJSON = function(url, done) {
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		var status, error, parsed;

		if (xhr.readyState === 4) {

			status = xhr.status;
			if (status > 399 && status < 600) {
				// An http 4xx or 5xx error. Signal an error.
				error = new Error(url + ' HTTP status: ' + status);
				error.xhr = xhr;
				done(error);

				return;
			}

			try {
				parsed = JSON.parse(xhr.responseText);
			} catch(err) {
				done(err);
				return;
			}

			done(null, parsed);
		}
	};

	xhr.open('GET', url, true);
	xhr.send(null);
};

var bower = {
	dir: 'bower_components',
	mainAttr: 'main',
	configFile: 'bower.json'
};

function addPackage(config, pkg) {
	if (!config.packages) {
		config.packages = [];
	}

	config.packages.push(pkg);

	(window.require || window.curl).config(config);
}

define({
	load: function(name, req, onload, config) {
		var packagesDir = bower.dir;
		var module = {
			id: name
		};
		var slashIdx = module.id.indexOf('/');

		if (slashIdx > 0) {
			module.id = module.id.slice(0, slashIdx);
		}
		if (module.id.indexOf('bower_components') === 0) {
			module.id = name.slice(slashIdx + 1, name.indexOf('/', slashIdx + 1));
			req([module.id], onload);
			return;
		}

		// Reference the `paths` object in the AMD configuration (if available)
		// to allow for user specification of a custom Bower installation
		// directory.
		if (config && config.paths && config.paths[packagesDir]) {
			packagesDir = config.paths[packagesDir];
		}

		module.root = packagesDir + '/' + module.id;

		getJSON(module.root + '/' + bower.configFile, function(err, meta) {
			var main;

			if (err) {
				onload.error(err);
				return;
			}

			if (slashIdx > 0) {
				main = name.slice(slashIdx + 1);
			} else {
				main = meta[bower.mainAttr];
			}

			addPackage(config, {
				name: name,
				location: module.root,
				main: main
			});

			if (meta.dependencies) {
				Object.keys(meta.dependencies).forEach(function(name) {
					addPackage(config, {
						name: name,
						location: 'bower!' + name
					});
				});
			}

			req([name], onload);
		});
	}
});

}());
