(function() {
'use strict';

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

	// TODO: Do not rely on RequireJS internals
	config.pkgs[pkg.name] = pkg.location;
	if (pkg.main) {
		config.pkgs[pkg.name] += '/' + pkg.main;
	}
}

define({
	load: function(name, req, onload, config) {
		var packagesDir = bower.dir;
		var packageDir = name;
		var slashIdx = packageDir.indexOf('/');
		var root;

		if (slashIdx > -1) {
			packageDir = packageDir.slice(0, slashIdx);
		}

		if (config && config.paths && config.paths[packagesDir]) {
			packagesDir = config.paths[packagesDir];
		}

		root = packagesDir + '/' + packageDir;

		getJSON(root + '/' + bower.configFile, function(meta) {
			var main;

			if (slashIdx > 0) {
				main = name.slice(slashIdx + 1);
			} else {
				main = meta[bower.mainAttr];
			}

			addPackage(config, {
				name: name,
				location: root,
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

			console.log(name);
			req([name], onload);
		});
	}
});

}());
