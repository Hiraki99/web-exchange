const path_controller = require("./utils/path")
const ejs = require("ejs")
const request = require('request');
const url = require('../config').url

const auth_api = url.AUTH_API
const deposit_app = url.SOCKET_HOST_DEPOSIT

function callback(data_request, url, cb) {
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }
    var options = {
        url: url,
        method: 'POST',
        headers: headers,
        json: data_request
    }

    // Start the request
    request(options, function (error, response, body) {
        cb(error, response, body)
    })
}

exports.index = (req, res) => {
    var data = {};
    if (req.user) {
        data.user_name = req.user.user_name
    } else data.user_name = null
    data.title = 'Home'
    var new_version = Math.round(Math.random() * 1000000)
    data["version"] = new_version
    return res.render('landing/landing', data);
};

exports.market = (req, res) => {
    var data = {};
    if (req.user) {
        data.user_name = req.user.user_name
    } else data.user_name = null
    if(req.role == "admin"){
        return res.redirect("/admin")
    }else{
        data.title = 'Market'
        var new_version = Math.round(Math.random() * 1000000)
        data.version = new_version;
        res.render('backoffice/market', data);
    }
    
}

exports.render = (req, res) => {
    var path_file = req.body.path;
    console.log(path_file)
    var file_render = path_controller.getPathFileRender(path_file);
    console.log(file_render)
    if (file_render == "not found") return res.sendStatus(500);

    else {
        var data_response = {
            "role": req.role
        }
        var data_request= {}
        if(req.user){
            data_request = {
                'user_id': req.user.user_id,
            }
        }
        
        switch (path_file) {
            case "wallet-currency":
                
                // Start the request1
                callback(data_request, deposit_app + '/account/balance/view', function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        // Print out the response body
                        body = body[0];
                        
                        var data_response = {
                            "status": body.status,
                            "existedBanking" : body.existedBanking
                        }
                        
                        if (body.status == 1) {
                            var account = body.account 
                            for(var k in account) {
                                data_response[k] = account[k]
                            }
                            
                            if(body.existedBanking){
                                data_response["banking"] = body.banking
                            }
                        }
                        ejs.renderFile(file_render, data_response, function (err, html) {
                            // console.log(html)
                            if (err) {
                                console.log(err)
                                return res.sendStatus(500);
                            }
                            return res.send(html);
                        });

                    } else res.sendStatus(500);
                })
                break;
            case "kyc":
                // Start the request1
                callback(data_request,  auth_api + '/checked-kyc', function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        // Print out the response body
                        var data_response = {
                            status: body.status,
                        }
                        console.log(body)
                        if(body.status != -1 ){
                            list_error = body.file_error.split(',')
                            list_error.forEach(element => {
                                data_response[element] = true
                            });
                            data_response["id_kyc"] = body.id
                        }
                        ejs.renderFile(file_render, data_response, function (err, html) {
                            // console.log(html)
                            if (err) {
                                console.log(err)
                                return res.sendStatus(500);
                            }
                            return res.send(html);
                        });

                    } else res.sendStatus(500);
                })
                break;
            case "admin/kyc":
                data_response["host_image"] = auth_api +"/static"
                ejs.renderFile(file_render, data_response, function (err, html) {
                    // console.log(html)
                    if (err) {
                        console.log(err)
                        return res.sendStatus(500);
                    }
                    return res.send(html);
                });
                break;

            default:
                ejs.renderFile(file_render, data_response, function (err, html) {
                    // console.log(html)
                    if (err) {
                        console.log(err)
                        return res.sendStatus(500);
                    }
                    return res.send(html);
                });
                break;

        }

    }


}