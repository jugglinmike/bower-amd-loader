suite('bower!!', function() {
	'use strict';

function testLoader(name, loaderName, url) {
	suite(name, function() {
		setup(function(done) {
			var iframe = this.iframe = document.createElement('iframe');
			iframe.setAttribute('style', 'display: none;');
			document.body.appendChild(iframe);
			var idoc = iframe.contentDocument;
			var iwin = iframe.contentWindow;
			var script = idoc.createElement('script');
			script.setAttribute('src', '../node_modules/' + url + '.js');

			this.configuration = {
				paths: {
					bower: '../bower'
				}
			};

			script.addEventListener('load', function() {
				this.require = iwin[loaderName];
				this.require.config(this.configuration);
				done();
			}.bind(this));

			idoc.head.appendChild(script);
		});

		teardown(function() {
			this.iframe.parentNode.removeChild(this.iframe);
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

		test('multiple invocations', function(done) {
			var require = this.require;
			require(['bower!when'], function() {
				require(['bower!when'], function() {
					done();
				});
			});
		});

		test('non-existent modules', function(done) {
			this.require(['bower!non-existent'], function() {
				done(new Error('Incorrectly invoked success callback'));
			}, function(err) {
				assert.ok(err);
				done();
			});
		});

		test('malformed bower.json files', function(done) {
			this.require(['bower!bad-config'], function() {
				done(new Error('Incorrectly invoked success callback'));
			}, function(err) {
				assert.ok(err);
				done();
			});
		});

		test('custom installation directory', function(done) {
			this.configuration.paths.bower_components = 'custom-bower-dir';
			this.require.config(this.configuration);
			this.require(['bower!a'], function(A) {
				assert.ok(A, 'Loads module');
				assert.ok(A.B, 'Loads module dependencies');
				assert.ok(A.B);
				done();
			});
		});
	});

}

testLoader('RequireJS', 'require', 'requirejs/require');
testLoader('curl', 'curl', 'curl-amd/dist/curl/curl');

});
