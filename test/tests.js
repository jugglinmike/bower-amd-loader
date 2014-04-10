suite('bower!!', function() {
	'use strict';;

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
			assert.isFunction(Layout);
			done();
		});
	});

	test('named modules', function(done) {
		testRequire(['bower!jquery'], function($) {
			assert.isFunction($);
			done();
		});
	});

	test('submodules', function(done) {
		testRequire(
			['bower!when', 'bower!when/delay'],
			function(when, whenDelay) {
				assert.isFunction(when);
				assert.isFunction(whenDelay);
				assert.notEqual(when, whenDelay);
				done();
			}
		);
	});
});
