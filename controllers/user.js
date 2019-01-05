const request = require('request');
const recaptra = require("./utils/recaptra")
const url = require('../config').url

const auth_api = url.AUTH_API
const deposit_app = url.SOCKET_HOST_DEPOSIT
const socket_client = require('socket.io-client');
var client_nodejs = socket_client(url.NODEJS_HOST, {
    path: '/home-page'
});
var fs = require('fs');

/**
 * GET /login
 * Login page.
 */


exports.getLogin = (req, res) => {
    if (req.user) {
        return res.redirect('/?token=' + req.query.token);
    }
    var new_version = Math.round(Math.random() * 100000)
    var data = {
        title: 'Login'
    }
    data["version"] = new_version
    if (req.param.status) data['status'] = 'Account active successful ! Please log in'
    else data['status'] = null;
    console.log(24)
    res.render('landing/login', data);
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {

    var data = req.body;
    var captra = req.body["g-recaptcha-response"];
    
    console.log(data);
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }
    recaptra.verifyRecaptcha(captra, function (checked_captra) {
        console.log(checked_captra)
        if (checked_captra) {
            var options = {
                url: auth_api + '/login',
                method: 'POST',
                headers: headers,
                json: {
                    'username': data.username,
                    'password': data.password
                }
            }

            // Start the request
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    // Print out the response body
                    console.log(body)

                    if (body.status == 1) {
                        // req.headers = {
                        //   'x-access-token': body.access_token
                        // }
                        console.log(60)
                        console.log(body.access_token);
                        client_nodejs.emit()
                        return res.json({
                            success: 1,
                            message: 'Log in success!',
                            token: body.access_token,
                            role: body.role
                        });
                    } else {
                        return res.json({
                            success: 0,
                            message: 'Invalid Username or Password!',
                            token: body.access_token,
                            role: body.role
                        });
                    }
                }
            })
        } else {
            res.json({
                success: 0,
                message: 'Invalid Username or Captra!'
            });

        }
    })
    // Configure the request

};

exports.postLogout = (req, res, next) => {

    var data = req.body;
    token_revoke = req.headers['x-access-token']
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json',
        "Authorization": 'Bearer ' + token_revoke
    }
    var options = {
        url: auth_api + '/logout',
        method: 'POST',
        headers: headers,
        json: {}
    }

    // Start the request
    request(options, function (error, response, body) {
        req.user = null
        res.redirect('/')
    })

};
exports.resetPassword = (req, res) => {
    return res.render('landing/reset-password');
}

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res, next) => {
    var new_version = Math.round(Math.random() * 100000)

    if (req.user) {
        return res.redirect('/');
    }
    var data = {
        title: 'Create Account',
        'error': null
    }
    if (req.params.error) {
        data.error = "Account confirm error. Please Reconfirm account"
    } else data.error = null
    if (req.params.email) {
        data.email = req.params.email
    } else data.email = null
    data["version"] = new_version
    console.log("data" + data)
    res.render('landing/signup', data);
};


/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res) => {

    var data = req.body;
    var captra = req.body["g-recaptcha-response"];
    console.log(data);
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }
    var domain_active = req.protocol + '://' + req.get('host')
    var options = {
        url: auth_api + '/new-user',
        method: 'POST',
        headers: headers,
        json: {
            'email': data.email,
            'password': data.password,
            'username': data.username,
            'domain_active': domain_active
        }
    }
    recaptra.verifyRecaptcha(captra, function (checked_recaptra) {
        if (checked_recaptra) {
            // Start the request
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    // Print out the response body
                    console.log(body);
                    return res.send(body)
                }
            })
        }
    })


};

// Get Blog 
exports.getBlog = (req, res) => {
    var data = {};
    if (req.user) {
        data.user_name = req.user.user_name
        data.token = req.session['x-access-token']
    } else data.user_name = null
    data.title = 'Blog'
    res.render('landing/blog', data);
};
exports.postBlog = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
};

exports.confimAccount = (req, res) => {
    var token = req.params.token;
    var email = req.params.email;
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }
    var options = {
        url: auth_api + '/confirm-account',
        method: 'POST',
        headers: headers,
        json: {
            'token': token,
            'email': email
        }
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log(body);
            // body = JSON.parse(body);
            if (body.status == 0 || body.status == -1) {
                return res.redirect('/signup/1/' + email)
            } else {
                return res.redirect('/login/1')
            }
        }
    })
}
exports.resend = (req, res, next) => {
    var body = req.body;
    email = body.email;
    console.log(body);
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }
    var domain_active = req.protocol + '://' + req.get('host')
    var options = {
        url: auth_api + '/resend-confirm',
        method: 'POST',
        headers: headers,
        json: {
            'email': email,
            'domain_active': domain_active
        }
    }
    console.log(JSON.stringify({
        'email': email,
        'domain_active': domain_active
    }));
    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log(body);
            // body = JSON.parse(body);
            return res.send(body)
        }
    })

}
exports.getDasboard = (req, res) => {
    var data = {}
    data.title = "Dashboard"
    if (req.user) {
        data.user_name = req.user.user_name
    }
    return res.render('landing/dashboard', data)
}
exports.postDashboard = (req, res) => {
    var data = {}
    data.title = "Dashboard"
    if (req.user) {
        data.user_name = req.user.user_name
        data.token = req.headers['x-access-token']
    }
    
    return res.send(JSON.stringify(data))
}

exports.wallet = (req, res) => {
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }
    var data_request = {
        'user_id': req.user.user_id,
    }


    var options = {
        url: deposit_app + '/account/balance/view',
        method: 'POST',
        headers: headers,
        json: data_request
    }
    var data_response = {}
    data_response["user_name"] = req.user.user_name
    data_response['link'] = '/en/trade/'
    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body


            body = body[0];

            if (body.status == 1) {
                data_response['status'] = body.status

                for (var i = 0; i < body.account.length; i++) {
                    var item = body.account[i];
                    data_response[item.currency] = item
                }


            }

            return res.render('backoffice/wallet', data_response);
        }
    })
}

exports.openaccount = (req, res) => {
    var parameter = req.body;
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }
    var data_request = {
        'user_id': req.user.user_id,
        "currency": parameter.currency
    }
    console.log(347)
    console.log(data_request)
    var options = {
        url: deposit_app + '/account/open',
        method: 'POST',
        headers: headers,
        json: data_request
    }

    // Start the request
    request(options, function (error, response, body) {
        console.log(342)
        if (!error && response.statusCode == 200) {
            // Print out the response body


            body = body[0];
            console.log(body)
            if (body.status == 1) {
                return res.json({
                    status: body.status,
                    account: body.account,

                });
            } else {
                return res.json({
                    status: 0

                });
            }
        }
    })

}
exports.account_transaction = (req, res) => {
    var parameter = req.body;
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }
    var data_request = {
        'user_id': req.user.user_id,
    }
    if (parameter.account_no)
        data_request["account_no"] = parameter.account_no
    var options = {
        url: deposit_app + '/account/history',
        method: 'POST',
        headers: headers,
        json: data_request
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            
            body = body[0];
            return res.json({
                status: body.status,
                transaction: body.transaction,
                transaction_trading : body.transaction_trading
            });
        }
    })
}
exports.create_transaction = (req, res) => {
    var parameter = req.body;
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }

    var data_request = {
        "to" : parameter["to"],
        "account_id": parameter["account_id"],
        "account_no": parameter["account_no"],
        "currency": parameter["currency"],
        "value": parameter["value"],
        "deposit_method": parameter["deposit_method"],
        "user_id": req.user.user_id,
        "kind": parameter["kind"]
    }



    var options = {
        method: 'post',
        headers: headers,
        json: data_request
    }
    if (parameter["kind"] == "depo") {
        options["url"] = "http://localhost:5020/deposit/open"
    }
    if (parameter["kind"] == "with") {
        options["url"] = "http://localhost:5020/withdraw/open"
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body

            body = body[0];

            return res.send(body);
        }
    })
}
exports.history_transaction = (req, res) => {
    var parameter = req.body;
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }

    var data_request = {
        "user_id": req.user.user_id,
        "kind": parameter["kind"]
    }



    var options = {
        url: deposit_app + '/account/history',
        method: 'post',
        headers: headers,
        json: data_request
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body

            body = body[0];
            console.log(481)
            console.log(body)
            return res.send(body);
        }
    })
}
exports.wallet_info = (req, res) => {
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }
    var data_request = {
        'user_id': req.user.user_id,
    }



    var options = {
        url: deposit_app + '/account/balance/view',
        method: 'POST',
        headers: headers,
        json: data_request
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            body = body[0];
            var data_response = {
                status: body.status
            }
            console.log(body)
            if (body.status == 1) {
                var account = body.account 

                for(var k in account) {
                    data_response[k] = account[k]
                }
            }
            console.log(data_response)
            return res.send(data_response);

        }
    })
}
exports.check_kyc = (req, res) => {
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }
    var data_request = {
        'user_id': req.user.user_id
    }
    console.log(534)
    console.log(data_request)
    var options = {
        url: auth_api + '/checked-kyc',
        method: 'POST',
        headers: headers,
        json: data_request
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("532: " + body.status)
            return res.json({
                status: body.status
            })
        }
    })
}
exports.add_kyc = (req, res) => {
    var img_front = req.files.step1;
    var img_selfie = req.files.step2;
    var img_face_t_rex = req.files.step3;
    var img_alternative = req.files.step4;

    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }

    // var stream_front = fs.ReadStream(img_face_t_rex[0].buffer)
    var data_request = {
        'full_name': req.body.fullname,
        'id_verify': req.body.id_verify,
        'phone': req.body.phone,
        'image_front_verify': {
            value: img_front[0].buffer, // Upload the first file in the multi-part post
            options: {
                filename: img_front[0].originalname
            }
        },
        'image_selfie_verify': {
            value: img_selfie[0].buffer, // Upload the first file in the multi-part post
            options: {
                filename: img_selfie[0].originalname
            }
        },
        'image_with_verify': {
            value: img_face_t_rex[0].buffer, // Upload the first file in the multi-part post
            options: {
                filename: img_face_t_rex[0].originalname
            }
        },
        'image_alternative': {
            value: img_alternative[0].buffer, // Upload the first file in the multi-part post
            options: {
                filename: img_alternative[0].originalname
            }
        }
    }

    var options = {
        url: auth_api + '/add-kyc',
        method: 'POST',
        headers: headers,
        json: true,
        formData: data_request
    }
    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            var data_response = {
                status: body.status
            }
            return res.send(data_response);
        }
    })
}
exports.update_kyc = (req, res) => {
    var img_front = req.files.step1;
    var img_selfie = req.files.step2;
    var img_face_t_rex = req.files.step3;
    var img_alternative = req.files.step4;

    console.log(img_front)
    console.log(img_selfie == undefined)
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }
    var data_request = {
        'id' : req.body.id,
        'field_error' : '',
        'status': 0
    }
    if (req.body.fullname != undefined)
        data_request["full_name"] = req.body.fullname
    if (req.body.id_verify != undefined)
        data_request["id_verify"] = req.body.id_verify
    if (req.body.phone != undefined)
        data_request["phone"] = req.body.phone
    if (img_selfie != undefined)
        data_request["image_selfie_verify"] = {
            value: img_selfie[0].buffer, // Upload the first file in the multi-part post
            options: {
                filename: img_selfie[0].originalname
            }
        }
    if (img_face_t_rex != undefined)
        data_request["image_with_verify"] = {
            value: img_face_t_rex[0].buffer, // Upload the first file in the multi-part post
            options: {
                filename: img_face_t_rex[0].originalname
            }
        }
    if (img_alternative != undefined)
        data_request["img_alternative"] = {
            value: img_alternative[0].buffer, // Upload the first file in the multi-part post
            options: {
                filename: img_alternative[0].originalname
            }
        }
    if (img_front != undefined)
        data_request["image_front_verify"] = {
            value: img_front[0].buffer, // Upload the first file in the multi-part post
            options: {
                filename: img_front[0].originalname
            }
        }

    var options = {
        url: auth_api + '/update-kyc',
        method: 'POST',
        headers: headers,
        json: true,
        formData: data_request
    }
    console.log(options)

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            var data_response = {
                status: body.status
            }
            return res.send(data_response);
        }
    })

}
exports.check_exsited_banking = (req,res)=>{
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }
    var data_request = {
        "user_id" : req.user.user_id,
        "currency": req.body.currency
        
    }
    var options = {
        url: deposit_app + '/exister-banking',
        method: 'POST',
        headers: headers,
        json: data_request
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("532: " + body[0].status)
            return res.json({
                status: body[0].status
            })
        }
    })
}
exports.new_banking = (req,res)=>{
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }
    console.log(req.body)
    var data_request = {
        "user_id" : req.user.user_id,
        "bank_name" : req.body.bank_name,
        "bank_address" : req.body.bank_address,
        "number_bank_card": req.body.number_bank_card,
        "fullname_bank_card":req.body.fullname_bank_card
        }
    console.log(data_request)
    var options = {
        url: deposit_app + '/new-banking',
        method: 'POST',
        headers: headers,
        json: data_request
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("733: " + body)
            return res.json({
                "status": body[0].status
            })
        }
    })
}
exports.check_exsited_account_currency = (req,res)=>{
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }
    var data_request = {
        "user_id" : req.user.user_id,
        "currency": req.body.currency
        
    }
    console.log(751)
    console.log(data_request)
    var options = {
        url: deposit_app + '/exister-account-currency',
        method: 'POST',
        headers: headers,
        json: data_request
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("532: " + body[0].status)
            return res.json({
                status: body[0].status
            })
        }
    })
}
exports.getNewCodeDeposit = (req,res) =>{
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }
    var data_request = {
        "user_id" : req.user.user_id,
    }
    console.log(751)
    console.log(data_request)
    var options = {
        url: deposit_app + '/key-confirmation',
        method: 'POST',
        headers: headers,
        json: data_request
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log("789: " + body[0].status)
            return res.json(body[0])
            
        }
    })
}
exports.getCodeDeposit= (req,res) =>{
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }
    var data_request = {
        "user_id" : req.user.user_id
    }
    console.log(751)
    console.log(data_request)
    var options = {
        url: deposit_app + '/get-key-confirmation',
        method: 'POST',
        headers: headers,
        json: data_request
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("819: " + body[0].status)
            return res.json(body[0])
        }
    })
}