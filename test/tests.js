suite('bower!!', function() {

	var testRequire = function() {
		var context = require.config({
			paths: {
				bower: '../bower',
				bower_components: 'package-dirs/bower_components',
			},
			context: Math.random()
		});

		return context.apply(this, arguments);
	};

	test('complex dependencies', function(done) {
		testRequire(['bower!layoutmanager'], function(Layout) {
			done();
		});
	});

	test('named modules', function(done) {
		testRequire(['bower!jquery'], function($) {
			done();
		});
	});

	test('submodules', function(done) {
		testRequire(['bower!when', 'bower!when/delay'], function(when, whenDelay) {
			console.log(when === whenDelay);
			done();
		});
	});
});
