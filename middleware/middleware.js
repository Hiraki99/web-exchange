const jwt = require("jsonwebtoken");
const fs = require('fs');
const verifycert = fs.readFileSync('./key/mykey.pub');
const redis = require('redis');
const redis_client = redis.createClient(6379, "54.255.151.121");
var black_list = []


function checkValidateToken(token){
    // console.log("token "+token)
    if(typeof token != 'undefined' && token != null && token !=""){
         return true
    }
    else return false
}

exports.checkRole = function requireRole (role) {
    return function (req, res, next) {
        var token;
		// console.log("url "+ req.originalUrl)
		switch (req.method.toLowerCase()) {
			case 'post':
				token = req.headers['x-access-token']
				break;
			case 'get':
				token = req.query.token
				break;
		}
		// console.log("token "+token)
		// console.log("validate token: " +checkValidateToken(token))	
		// console.log(role)
		// console.log(role.indexOf('guest'))

		

		if (checkValidateToken(token)) {
			redis_client.get(token, function (error, result) {
				if (error || !result) {
					console.log(error);
					jwt.verify(token, verifycert, function (err, decoded) {
						if (err) {
							req.role ="guest"
							if(role.indexOf("guest")!=-1) next()
							else return res.redirect('/login')
						} else {
							var permision_user;
							try {
								permision_user = decoded.identity.permission[0]
								if (!req.user)
									req.user = {};
								req.user.user_name = decoded.identity['user_name']
								req.user.user_id = decoded.identity['user_id']
							}
							catch(err) {
							}
							req.role = permision_user
							if(role.indexOf(permision_user) !=-1) next()
							else res.redirect("/")
						}
					})
				}else{
					req.role ="guest"
					if(role.indexOf("guest")!=-1) next()
					else res.render("landing/404")
				}
				
			});
			
		}else{
            req.role ="guest"
            if(role.indexOf("guest")!=-1) next()
            else res.render("landing/404")
		}
		
    }
}
