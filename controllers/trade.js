const url = require('../config').url
const io = require('socket.io-client');
const request = require('request');

console.log("trade controller:")
console.log(url)
// const socket_pre_trade = io(url.SOCKET_HOST_PRE_TRADE + '/pre_trade/order')
function random(low, high) {
    return Math.random() * (high - low) + low;
}

//get
exports.showOrderBook = (req, res) => {
    var user_name = null;
    if (req.user) {
        var user_name = req.user.user_name
        var role = req.role
    }
    var link = '/en/trade/real-time-market/'
    var new_version = Math.round(random(0, 1000000))
    var listPair = [{
            pair: "eth-btc",
            symbol1: "ETH",
            symbol2: "BTC"
        }, {
            pair: "btc-usdt",
            symbol1: "BTC",
            symbol2: "USDT"
        }, {
            pair: "eth-usdt",
            symbol1: "ETH",
            symbol2: "USDT"
        },
        {
            pair: "btc-vnd",
            symbol1: "BTC",
            symbol2: "VND"
        }
    ]
    res.render('layout/layout_backoffice', {
        user_name: user_name,
        listPair: listPair,
        link: link,
        version: new_version,
        role: role
    });
}

// Send Order
exports.sendRequestOrder = (req, res) => {
    if (!req.user) {
        return res.send({
            'status': 0,
            "message": "User is not exist"
        })
    } else {
        var options = {
            uri: url.SOCKET_HOST_PRE_TRADE + '/pre_trade/order',
            body: {
                "userID": req.user.user_id,
                "OrderQty": req.body.OrderQty,
                "OrdType": req.body.OrdType,
                "Price": req.body.Price,
                "Side": req.body.Side,
                "Symbol": req.body.Symbol,
            }
        };
        if (typeof (req.body.SecondaryOrderID) != "undefined") {
            options.body['SecondaryOrderID'] = req.body.SecondaryOrderID
            options.body['UserOrder'] = req.body.UserOrder

            if (options.body['UserOrder'] == req.user.user_id) {
                return res.send({
                    "status": 0,
                    "message": "User match order same with user order"
                })
            }
        }
        if (typeof (req.body.type_trade) != "undefined") {
            options.uri = url.SOCKET_HOST_PRE_TRADE_REAL_TIME + '/pre_trade/order'
        }
        console.log(JSON.stringify(options))
        var socket = io(options.uri);
        socket.emit("order-new", options.body, function (data) {
            console.log(45)
            console.log("sendRequestOrder data: "+JSON.stringify(data))
            return res.send(data)
        })
    }
}

exports.sendRequestCancelOrder = (req, res) => {
    if (!req.user) {
        return res.send({
            'status': 0,
            "message": "User is not exist"
        })
    } else {
        if (req.body.UserID != req.user.user_id) {
            return res.send({
                'status': 0,
                "message": "User don't permission cancel order of other user"
            })
        } else {
            var options = {
                uri: url.SOCKET_HOST_PRE_TRADE + '/pre_trade/order',
                body: {
                    'ClOrdID': req.body.ClOrdID,
                    'Symbol': req.body.Symbol,
                    'Side': req.body.Side,
                    'OrderID': req.body.OrderID,
                    'userID': req.user.user_id
                }
            };
            if (typeof (req.body.type_trade) != "undefined") {
                options.uri = url.SOCKET_HOST_PRE_TRADE_REAL_TIME + '/pre_trade/order'
            }
            // console.log(JSON.stringify(options.body))
            var socket = io(options.uri);
            console.log("sendRequestCancelOrder")
            socket.emit("order-cancel", options.body, function (data) {
                console.log(82)
                // console.log(JSON.stringify(data))
                return res.send(data)
            })
        }

    }
}

exports.sendRequestViewAllOrders = (req, res) => {
    console.log('sendRequestViewAllOrders')
    try {
        var options = {
            uri: url.SOCKET_HOST_PRE_TRADE + '/pre_trade/order',
            body: {
                'Symbol': req.body.Symbol,
            }
        };
        if (typeof (req.body.type_trade) != "undefined") {
            options.uri = url.SOCKET_HOST_PRE_TRADE_REAL_TIME + '/pre_trade/order'
        }
        console.log("options.uri = " +options.uri)
        console.log("options.body = " +JSON.stringify(options.body))
        var socket = io(options.uri);
        socket.emit("order-view", options.body, function (data) {
            // console.log("sendRequestViewAllOrders " + JSON.stringify(data))
            data['is_guest'] = true
            // console.log("typeof(req.user)= " + typeof (req.user))
            if (typeof (req.user) != "undefined") {
                var user_id = req.user.user_id
                var list_my_order = [];
                data['ask'].forEach(element => {
                    if (element['UserID'] == user_id) {
                        list_my_order.push(element)
                    }
                });
                data['bid'].forEach(element => {
                    if (element['UserID'] == user_id) {
                        list_my_order.push(element)
                    }
                });
                // console.log("My-order " + JSON.stringify(list_my_order))
                data['my-order'] = list_my_order;
                data['is_guest'] = false
            }
            return res.send(data)
        })
    } catch (error) {
        console.log(error)
        return {
            'ask':[],
            'bid':[],
            'my-order':[],
            'is_guest':typeof (req.user) != "undefined"?true:false
        }
    }
}
exports.getAllOrders = (req, res) => {
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }
    // console.log(req.body)
    var data_request = {
        "UserID": req.user.user_id
    }
    // console.log(data_request)
    var options = {
        url: url.HOST_PRE_TRADE_DATA + '/get-all-execution-report',
        method: 'POST',
        headers: headers,
        json: data_request
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            return res.send({
                "res": body[0]
            })
        }
    })
}
exports.avaiable_balance = (req, res) => {
    // console.log("avaiable_balance")
    try {
        var options = {
            uri: url.SOCKET_HOST_PRE_TRADE + '/pre_trade/order',
            body: {
                'Symbol': req.body.Symbol,
                'UserID': req.user.user_id
            }
        };
        console.log(options)
        var user_id = req.user.user_id;
        var socket = io(options.uri);
        socket.emit("balance-view", options.body, function (data) {
            // console.log("avaiable_balance: "+JSON.stringify(data))
            return res.send(data)
        })
    } catch (error) {
        console.log(error)
    }
}
exports.topOrder = (req, res) => {
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }
    // console.log(req.body)
    var data_request = {

    }
    // console.log(data_request)
    var options = {
        url: url.HOST_PRE_TRADE_DATA + '/get-top-lastest-execution-report',
        method: 'POST',
        headers: headers,
        json: data_request
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            return res.json({
                "res": body[0]
            })
        }
    })
}
exports.lastestTradeHistoryOtc =(req,res)=>{
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }
    var data_request = {

    }
    var options = {
        url: url.HOST_PRE_TRADE_DATA + '/get-top-lastest-trade-history-otc-execution-report',
        method: 'POST',
        headers: headers,
        json: data_request
    }

    // Start the request
    request(options, function (error, response, body) {
        // console.log("lastestTradeHistoryOtc"+JSON.stringify(response))
        if (!error && response.statusCode == 200) {
            console.log("252: " + body[0])
            return res.json({
                "res": body[0]
            })
        }
    })
}
exports.lastestTradeHistoryRealtime =(req,res)=>{
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }
    var data_request = {
        "Symbol": req.body.Symbol
    }
    var options = {
        url: url.HOST_PRE_TRADE_DATA + '/get-top-lastest-trade-history-realtime-execution-report',
        method: 'POST',
        headers: headers,
        json: data_request
    }

    // Start the request
    request(options, function (error, response, body) {
        // console.log("lastestTradeHistoryRealtime"+JSON.stringify(response))
        if (!error && response.statusCode == 200) {
            return res.json({
                "res": body[0]
            })
        }else{
            return null
        }
    })
}
exports.totalDailyTransaction = (req,res)=>{
    console.log("totalDailyTransaction")
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/json'
    }
    var data_request = {

    }
    var options = {
        url: url.SOCKET_HOST_DEPOSIT + '/total-daily-transaction',
        method: 'POST',
        headers: headers,
        json: data_request
    }

    // Start the request
    request(options, function (error, response, body) {
        // console.log("totalDailyTransaction response"+JSON.stringify(response))
        if (!error && response.statusCode == 200) {
            // console.log("totalDailyTransaction: " + body[0])
            return res.send(body[0])
        }
    })
}