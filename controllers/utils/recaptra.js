var https = require('https');
var SECRET ="6LcyoV8UAAAAAFvhxONlZi_gXZ9xBXDx_pmH0XX6"
exports.verifyRecaptcha =  function verifyRecaptcha(key, callback) {
	https.get("https://www.google.com/recaptcha/api/siteverify?secret=" + SECRET + "&response=" + key, function(res) {
		var data = "";
		res.on('data', function (chunk) {
			data += chunk.toString();
		});
		res.on('end', function() {
			try {
				var parsedData = JSON.parse(data);
				callback(parsedData.success);
			} catch (e) {
				console.log(e);
				callback(false);
			}
		});
	});
}