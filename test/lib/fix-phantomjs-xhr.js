/**
 * @file - Because PhantomJS does not manage the status code of XMLHttpRequest
 * objects (it is always 0), the behavior needs to be simulated for that
 * environment.
 *
 * TODO: Remove this shim when the underlying bug in PhantomJS is resolved:
 * https://github.com/ariya/phantomjs/issues/11195
 */
(function(window) {
'use strict';

var XHR = window.XMLHttpRequest;

var XHRShim = function() {
	var _xhr = this._xhr = new XHR();
	var self = this;

	// Copy shim explanation to the instance itself.
	this.FAKE = this.FAKE;

	_xhr.onreadystatechange = function() {
		self.readyState = _xhr.readyState;
		self.responseText = _xhr.responseText;
		if (_xhr.readyState === 4) {
			self.status = _xhr.status;
			if (!_xhr.responseText) {
				self.status = 400;
			}
		}
		if (typeof self.onreadystatechange === 'function') {
			self.onreadystatechange();
		}
	};
};

// Attach explanation to shimmed object to help avoid confusion in the future.
XHRShim.prototype.FAKE = 'This object created as a proxy to XMLHttpRequest ' +
  'in order to fix the behavior of that object in PhantomJS. See ' +
  'test/lib/fix-phantomjs-xhr.js for more information.'

XHRShim.prototype.open = function() {
	return this._xhr.open.apply(this._xhr, arguments);
};

XHRShim.prototype.send = function() {
	return this._xhr.send.apply(this._xhr, arguments);
};

window.XMLHttpRequest = XHRShim;

})(this);
