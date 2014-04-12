suite('bower!!', function() {
	'use strict';

	// TODO: Re-implement to support AMD script loaders that do not support the
	// `context` configuration option.
	var createRequire = function(configuration) {
		configuration.context = +(new Date());
		return require.config(configuration);
	};

	setup(function() {
		this.configuration = {
			paths: {
				bower: '../bower'
			}
		};
		this.require = createRequire(this.configuration);
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

	test.skip('multiple invocations', function(done) {
		var require = this.require;
		require(['bower!when'], function() {
			require(['bower!when'], function() {
				done();
			});
		});
	});

	test('non-existent modules', function(done) {
		this.require = createRequire(this.configuration);
		this.require(['bower!non-existent'], function() {
			done(new Error('Incorrectly invoked success callback'));
		}, function(err) {
			assert.instanceOf(err, Error);
			done();
		});
	});

	test('custom installation directory', function(done) {
		this.configuration.paths.bower_components = 'custom-bower-dir';
		this.require = createRequire(this.configuration);
		this.require(['bower!a'], function(A) {
			assert.ok(A, 'Loads module');
			assert.ok(A.B, 'Loads module dependencies');
			assert.ok(A.B);
			done();
		});
	});
});
