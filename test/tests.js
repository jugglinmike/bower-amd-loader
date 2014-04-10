suite('bower!!', function() {
	'use strict';;

	setup(function() {
		this.configuration = {
			paths: {
				bower: '../bower',
				bower_components: 'package-dirs/bower_components',
			},
			context: Math.random()
		};
		this.require = require.config(this.configuration);
	});

	test('complex dependencies', function(done) {
		this.require(['bower!layoutmanager'], function(Layout) {
			assert.isFunction(Layout);
			done();
		});
	});

	test('named modules', function(done) {
		this.require(['bower!jquery'], function($) {
			assert.isFunction($);
			done();
		});
	});

	test('submodules', function(done) {
		this.require(
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
