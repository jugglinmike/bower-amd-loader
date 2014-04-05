require({
	paths: {
		ext: '../ext',
		jquery: 'ext!bower?jquery',
		bower_components: 'package-dirs/bower_components'
	},

	map: {
		'*': {
			backbone: 'ext!bower?backbone',
			underscore: 'ext!bower?underscore',
			jquery: 'ext!bower?jquery'
		}
	}
});
