const request = require("request")
const deposit_app = "http://54.255.151.121:5020"
const auth_api = "http://54.255.151.121:8001"
// const auth_api = "http://0.0.0.0:8001"
exports.showAdminPage = (req,res) => {
    var user_name = null;
    if(req.user){
        var user_name = req.user.user_name
    }
    var new_version = Math.round(Math.random()*100000)
    res.render('layout/layout_admin',{user_name:user_name,version: new_version});
}

exports.showAllTransaction = (req,res) => {
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }
    
    var options = {
        url: deposit_app+ '/withdraw/all_transaction',
        method: 'POST',
        headers: headers,
        json: {}
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body

            body = body[0];
            return res.json(body)
        }
    })
}
exports.list_kyc = (req,res)=>{
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }
    
    var options = {
        url: auth_api+ '/kyc-pending',
        method: 'POST',
        headers: headers,
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            return res.json(body)
        }
    })
}
exports.verify_kyc = (req, res) => {
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }
    var data_request = {
        "id" : parseInt(req.body.id),
        'field_error' : req.body.field_error,
        'status' : req.body.status
    }
    console.log(data_request)
    var options = {
        url: auth_api + '/update-kyc',
        method: 'POST',
        headers: headers,
        formData: data_request
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            return res.send(body);
        }
    })
}