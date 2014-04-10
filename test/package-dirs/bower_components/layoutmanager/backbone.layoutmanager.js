(function(window, factory) {
  "use strict";
  var Backbone = window.Backbone;

  // AMD. Register as an anonymous module.  Wrap in function so we have access
  // to root via `this`.
  if (typeof define === "function" && define.amd) {
    return define(["backbone", "underscore", "jquery"], function() {
      return factory.apply(window, arguments);
    });
  }

  // Browser globals.
  Backbone.Layout = factory.call(window, Backbone, window._, Backbone.$);
}(typeof global === "object" ? global : this, function (Backbone, _, $) {
"use strict";

  return function() {};

}));
