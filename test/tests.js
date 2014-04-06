suite('ext!', function() {

	test('bower', function(done) {
		require(['ext!bower?layoutmanager'], function(Layout) {
			done();
		});
	});

});
