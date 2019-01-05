/**
 * Note:
 * Lệnh không khớp hết này (mà còn thừa hoặc thiếu) thì các thông số thay đổi sẽ được sáng nháy lên (xanh hoặc đỏ)
 * 
 */


function order_buy_realtime() {
    // console.log("afdf = " + Math.floor(Math.random() * 100000))
    console.log("order buy")
    try {
        var amount = parseFloat($('#order_entry_amount_bid').val())
        var price = parseFloat($('#order_entry_price_bid').val())
        var total = parseFloat($('#order_entry_total_bid').val())
        var fee = parseFloat($('#order_entry_fee_buy').val())
        var avaiable_before = Util.fix_number(parseFloat(Util.format_number_to_calculate($('.avaiable_balance_buy').html())), 5)
        var check = Util.check_validate_buy_coin(amount, price, total)
        if (check != true) {
            return Util.notify_order_invalid(check)
        }
        //send request
        var pair = $("#list-pair-real-time-market").val().split('-')
        try {
            var symbol = pair[0].toUpperCase() + "/" + pair[1].toUpperCase();
            var side = "Buy"
            var ordType = 'LO'
            price = parseFloat(price)
            amount = parseFloat(amount)
            api_create_realtime_order(amount, price, symbol, side, ordType)
        } catch (error) {
            console.log("may be pair is null, error: " + error)
        }

    } catch (err) {
        console.log(err);
    }
}

function order_sell_realtime() {
    try {
        var amount = parseFloat($('#order_entry_amount_sell').val())
        var price = parseFloat($('#order_entry_price_sell').val())
        var total = parseFloat($('#order_entry_total_sell').val())
        var fee = parseFloat($('#order_entry_fee_sell').val())
        var avaiable_before = Util.fix_number(parseFloat(Util.format_number_to_calculate($('.avaiable_balance_sell').html())), 5)

        var check = Util.check_validate_sell_coin(amount, price, total)
        if (check != true) {
            return Util.notify_order_invalid(check)
        }
        //send request
        var pair = $("#list-pair-real-time-market").val().split('-')
        try {
            var symbol = pair[0].toUpperCase() + "/" + pair[1].toUpperCase();
            var side = "Sell"
            var ordType = 'LO'
            price = parseFloat(price)
            amount = parseFloat(amount)
            api_create_realtime_order(amount, price, symbol, side, ordType)
        } catch (error) {
            console.log("may be pair is null, error: " + error)
        }
    } catch (err) {
        console.log(err);
    }
}
function api_create_realtime_order(amount, price, symbol, side, ordType) {
    $("#order_trade").modal("hide")

    var data = {
        'OrderQty': amount,
        'OrdType': ordType,
        'Price': price,
        'Side': side,
        'Symbol': symbol,
        "type_trade": "ECN"
    }
    var message = [":", side, amount, symbol.split('/')[0], "Price", price].join(' ')
    console.log(message)
    $.ajax({
        headers: {
            "x-access-token": localStorage.getItem("token")
        },
        url: '/api/trade/real-time-market/order',
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function (json) {
            console.log("api_create_otc_order " + json)
            if (json.status == 0) message = json.message
            else {
                if (side == 'Buy') {
                    var all_price_buy = (parseFloat($('#locked_buy_account').data('amount')) + parseFloat(amount)).toFixed(5)
                    $("#locked_buy_account").html(Util.format_number_to_show(all_price_buy))
                    $("#locked_buy_account").data('amount', all_price_buy);
                    $("#locked_buy_account").addClass('balance-info-blink');
                    $(".avaiable_balance_buy").addClass('balance-info-blink');

                    $('.avaiable_balance_buy').html((parseFloat(Util.format_number_to_calculate($('.avaiable_balance_buy').html())) - parseFloat(amount * price)).toFixed(5))
                } else {
                    var all_price_sell = (parseFloat($('#locked_sell_account').data('amount')) + parseFloat(amount)).toFixed(5)

                    $('.avaiable_balance_sell').html((parseFloat(Util.format_number_to_calculate($('.avaiable_balance_sell').html())) - amount).toFixed(5))
                    $(".avaiable_balance_sell").addClass('balance-info-blink');

                    $("#locked_sell_account").html(Util.format_number_to_show(all_price_sell))
                    $("#locked_sell_account").data('amount', all_price_sell);

                    $("#locked_sell_account").addClass('balance-info-blink');
                }
                Util.list_my_order.push(json["report"])
                update_list_my_order_realtime(Util.list_my_order)
                setTimeout(function () {
                    $("#locked_buy_account").removeClass('balance-info-blink');
                    $(".avaiable_balance_buy").removeClass('balance-info-blink');
                    $("#locked_sell_account").removeClass('balance-info-blink');
                    $(".avaiable_balance_sell").removeClass('balance-info-blink');
                }, 500);

            }
            reset_input(side, symbol);
            notify_order(json, message)
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function confirm_cancel_realtime_order(ClOrdID, symbol, Side, OrderID, UserCancel) {
    $("#order_trade").modal("hide")
    var data = {
        'ClOrdID': ClOrdID,
        'Symbol': symbol,
        "Side": Side,
        "OrderID": OrderID,
        "UserID": UserCancel,
        "type_trade": "ECN"
    }
    $.ajax({
        headers: {
            "x-access-token": localStorage.getItem("token")
        },
        url: '/api/trade/real-time-market/cancel-order',
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function (json) {
            // console.log("call_api_cancel_order" + json)
            notify_cancel_order_realtime(json)
        }
    });
}

function notify_cancel_order_realtime(data) {
    console.log("notify_cancel_order")
    console.log(JSON.stringify(data))
    if (data['status'] == 1) {
        Util.notify_status_order(true, 'Canceled', data['report']['OrderID'], '')

        console.log('#my_order_' + data['report']['OrderID'])
        $('#my_order_' + data['report']['OrderID']).remove()

        if (data['report']['Side'] == 'Buy') {

            $('.avaiable_balance_buy').html((parseFloat(Util.format_number_to_calculate($('.avaiable_balance_buy').html())) + (parseFloat(data["cancel_report"]["OrderQty"]) - parseFloat(data["cancel_report"]["LeavesQty"])) * parseFloat(data["cancel_report"]["Price"])).toFixed(5))
            if (parseFloat(Util.format_number_to_calculate($('#locked_buy_account').html())) != 0)
                $('#locked_buy_account').html((parseFloat(Util.format_number_to_calculate($('#locked_buy_account').html())) - parseFloat(data["cancel_report"]["OrderQty"]) + parseFloat(data["cancel_report"]["LeavesQty"])).toFixed(5))

        } else {
            $('.avaiable_balance_sell').html((parseFloat(Util.format_number_to_calculate($('.avaiable_balance_sell').html())) + (parseFloat(data["cancel_report"]["OrderQty"]) - parseFloat(data["cancel_report"]["LeavesQty"]))).toFixed(5))
            if (parseFloat(Util.format_number_to_calculate($('#locked_buy_account').html())) != 0)
                $('#locked_sell_account').html((parseFloat(Util.format_number_to_calculate($('#locked_sell_account').html())) - (parseFloat(data["cancel_report"]["OrderQty"]) + parseFloat(data["cancel_report"]["LeavesQty"]))).toFixed(5))

        }
        $(".avaiable_balance_buy").addClass('balance-info-blink');
        $(".avaiable_balance_sell").addClass('balance-info-blink');
        setTimeout(function () {

            $(".avaiable_balance_buy").removeClass('balance-info-blink');

            $(".avaiable_balance_sell").removeClass('balance-info-blink');
        }, 500);
    } else {
        Util.notify_status_order(true, 'Cancel', data['cancel_report']['OrderID'], ': cancel order error')
    }
}
function cancel_order_realtime(ClOrdID, symbol, Side, OrderID, UserCancel, Price, OrderQty) {
    confirm_cancel_realtime_order(ClOrdID, symbol, Side, OrderID, UserCancel)
}

function notify_order_realtime(json, message) {
    console.log(JSON.stringify(json))
    if (json.status == 1) {
        $("#all-order-realtime > tbody >tr>td >center").parent().remove()
        Util.notify_status_order(true, json['report']['Side'], json['report']['OrderID'], message)

        var strVar = `<tr class="order-manager-new" id="my_order_${json['report']['OrderID']}">
            <td class="order-manager-order-date">${formatDate(json['report']['TransactTime'])}</td>
            
            <td class="order-manager-description">${json['report']['Side']}ing ${Util.format_number_to_show(json['report']['OrderQty'])} ${json['report']['Symbol'].split('/')[0]}</td>
            
            
            <td class="order-manager-status">${json['report']['OrdStatus']}</td>
            <td class="order-manager-avg-price">${Util.format_number_to_show(json['report']['Price'])}</td>
            <td class="order-manager-volume">${Util.format_number_to_show(parseFloat(json['report']['OrderQty'] * json['report']['Price']).toFixed(5))}</td>
            <td class="order-manager-actions">
                <button class="btn btn-sm btn-danger" onclick="cancel_order('${json['report']['ClOrdID']}','${json['report']['Symbol']}','${json['report']['Side']}','${json['report']['OrderID']}',${json['report']['UserID']},${json['report']['Price']},${json['report']['OrderQty']})">cancel</button>
            </td>
        </tr>`
        $("#all-order-realtime > tbody").prepend(strVar)
    } else if (json.status == 2) {
        $("#all-order-realtime > tbody >tr>td >center").parent().remove()
        Util.notify_status_order(true, json['report']['Side'], json['report']['OrderID'], ": Order execution complete")

        //update list 
        var strVar =
            `<tr class="order-manager-new" id="my_order_${json['report']['OrderID']}">
                <td class="order-manager-order-date">${formatDate(json['report']['TransactTime'])}</td>
                <td class="order-manager-description">${json['report']['Side']} ${Util.format_number_to_show(json['report']['OrderQty'])} ${json['report']['Symbol'].split('/')[0]}</td>
                <td class="order-manager-status">${json['report']['OrdStatus']}</td>
                <td class="order-manager-avg-price">${Util.format_number_to_show(json['report']['Price'])}</td>
                <td class="order-manager-volume">${Util.format_number_to_show(parseFloat(json['report']['OrderQty'] * json['report']['Price']).toFixed(5))}</td>
                <td class="order-manager-actions">
                    Completed
                </td>
            </tr>`
        $("#all-order-realtime > tbody").prepend(strVar)
    } else {
        Util.notify_status_order(false, '', Math.floor(Math.random() * 1000000), message)
    }
}

function add_item_ask(data) {
    var strVar = `<tr style='width:100%;cursor:pointer' >
            <td style="color: rgb(236, 83, 83)" class="real-time-market-price-ask">${Util.format_number_to_show(data['Price'])}</td>
            <td style="text-align: center" class="real-time-market-price-ask">${Util.format_number_to_show(Util.fix_number(data['Amount'], 5))}</td>
            <td style="text-align: right" class="real-time-market-price-ask">${Util.format_number_to_show(Util.fix_number(parseFloat(data['Price']) * parseFloat(data['Amount']), 5))}</td>
        </tr>`
    $('#table_ask_realtime_market > tbody').prepend(strVar)
}
function add_item_ask_empty() {
    var strVar = `<tr style='width:100%' > 
            <td style="color: rgb(236, 83, 83)" class="real-time-market-price-ask">-</td>
            <td style="text-align: center" class="real-time-market-price-ask">-</td>
            <td style="text-align: right" class="real-time-market-price-ask">-</td>
        </tr>`
    $('#table_ask_realtime_market > tbody').prepend(strVar)
}

function add_item_bid(data) {
    var strVar = ` <tr  style='width:100%;cursor:pointer' >
            <td style="width: 30%;color: rgb(117, 226, 74)">${Util.format_number_to_show(Util.fix_number(data['Price'], 5))}</td>
            <td style="width: 30%;text-align: center" >${Util.format_number_to_show(Util.fix_number(data['Amount'], 5))}</td>
            <td style="width: 30%;text-align: right" >${Util.format_number_to_show(Util.fix_number(parseFloat(data['Price']) * parseFloat(data['Amount']), 5))}</td>
        </tr>`
    $('#table_bid_realtime_market >tbody').append(strVar)
}
function add_item_bid_empty() {
    var strVar = ` <tr style='width:inherit' >
            <td style="color: rgb(117, 226, 74)" class="real-time-market-price-bid">-</td>
            <td style="text-align: center" class="real-time-market-price-bid">-</td>
            <td style="text-align: right" class="real-time-market-price-bid">-</td>
        </tr>`
    $('#table_bid_realtime_market >tbody').append(strVar)
}


function update_list_ask_realtime(listAsk, is_show_effect) {
    try {
        console.log("update_list_ask")
        $('#table_ask_realtime_market > tbody').html("")
        var count = 0;
        if(listAsk.length>0){
            Util.sort_list_order(listAsk, "ASC")
            Util.merge_list_order(listAsk).forEach(order => {
                count++
                if (count >= Util.AMOUNT_BID_ASK_SHOW)
                    return
                add_item_ask(order)
            });
        }
        while (count < 8) {
            count++
            add_item_ask_empty()
        }
    } catch (error) {
        console.log(error)
    }
}

function update_list_bid_realtime(listBid, is_show_effect) {
    try {
        console.log("update_list_bid")
        $('#table_bid_realtime_market > tbody').html("")
        var count = 0;
        if(listBid.length>0){
            Util.sort_list_order(listBid, "DESC")
            Util.merge_list_order(listBid).forEach(order => {
                count++
                add_item_bid(order)
                if (count >= Util.AMOUNT_BID_ASK_SHOW)
                    return
            });
        }
        while (count < 8) {
            count++
            add_item_bid_empty()
        }
    } catch (error) {
        console.log(error)
    }
}

function update_current_value(data) {
    try {
        console.log("('#current_price').html() = " + $('#current_price').html())
        var cur_val = parseFloat($('#current_price').html())
        if (cur_val < parseFloat(data['current_price'])) {
            $('#current_price').css('color', "rgb(117, 226, 74)")
        } else if (cur_val > parseFloat(data['current_price'])) {
            $('#current_price').css('color', "rgb(236, 83, 83)")
        } else {
            $('#current_price').css('color', "")
        }
        $('#current_price').html(data['current_price'])
        // $('#current_price_dolar').html[data['current_price_dolar']]
    } catch (error) {
        console.log(error)
    }
}

function update_list_my_order_realtime(listMyOrder) {
    console.log("update_list_my_order_realtime")
    // console.log(listMyOrder)
    if (listMyOrder.length > 0) {
        Util.sort_to_time(listMyOrder)
        var str_my_order = ""
        listMyOrder.forEach(order => {
            var type_order_status = ""
            var type_order_class = "order-manager-"
            var type_order_action = ""
            var type_currency_total = ""
            if (order['Side'] == "Sell") {
                type_currency_total = order['AllocSettlCurrency']
            } else {
                type_currency_total = order['Currency']
            }
            if (order['OrdStatus'] == "New") {
                type_order_status = 'Watting'
                type_order_class += 'new'
                type_order_action = `<button class="btn btn-sm btn-danger" onclick="cancel_order_realtime('${order['ClOrdID']}','${order['Symbol']}','${order['Side']}','${order['OrderID']}',${order['UserID']},${order['Price']},${order['OrderQty']})">cancel</button>`

            } else if (order['OrdStatus'] == "Filled") {
                type_order_status = "Success"
                type_order_class += 'fill'
                type_order_action = "Completed"

            } else if (order['OrdStatus'] == "Canceled") {
                type_order_status = "Canceled"
                type_order_class += 'cancel'
                type_order_action = "Canceled"
            }
            str_my_order += `<tr class="${type_order_class}" id="my_order_${order['OrderID']}">
                <td class="order-manager-order-date">${formatDate(order['TransactTime'].split(".")[0])}</td>
                <td class="order-manager-Side">${order['Side']}</td>
                <td class="order-manager-status">${type_order_status}</td>
                <td class="order-manager-price">${Util.format_number_to_show(order['Price'])}</td>
                <td class="order-manager-amount">${Util.format_number_to_show(parseFloat(order['OrderQty']).toFixed(5))}</td>
                <td class="order-manager-filled">${Util.format_number_to_show(parseFloat(order['LeavesQty']).toFixed(5))}</td>
                <td class="order-manager-total">${Util.format_number_to_show(parseFloat(order['Price'] * order['OrderQty']).toFixed(5))}</td>
                <td class="order-manager-actions">${type_order_action}
                </td>
            </tr>`
        });
        $('#all-order-realtime > tbody').html(str_my_order)
    } else {
        $('#all-order-realtime > tbody').html(`<tr><td colspan = '8'><center><h6>No Order</h6></center></td></tr>`)
    }
}


function update_after_cancel_order_realtime(data) {
    console.log("update_after_cancel_order_realtime")
    try {
        if (data['type'] == "cancel") {

            if (data['order']['Side'] == "Sell") {
                var i = 0
                Util.old_list_ask.forEach(element => {
                    if (element['OrderID'] == data['order']['OrderID']) {
                        Util.old_list_ask.splice(i, 1)
                    }
                    i++;
                });
                update_list_ask_realtime(Util.old_list_ask, true)
            } else {
                var i = 0
                Util.old_list_bid.forEach(element => {
                    if (element['OrderID'] == data['order']['OrderID']) {
                        Util.old_list_bid.splice(i, 1)
                    }
                    i++;
                });
                update_list_bid_realtime(Util.old_list_bid, true)
            }
        }
    } catch (error) {
        console.log("update_after_new_order error" + error)
    }
}

function load_trade_history_order_realtime() {
    console.log("load_trade_history_order_realtime")
    var pair = localStorage.getItem("pair").split('-')
    var symbol = pair[0].toUpperCase() + "/" + pair[1].toUpperCase();
    var data = {
        'Symbol': symbol
    }
    $.ajax({
        type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
        url: '/api/trade/real-time-market/top-trade-history-realtime', // the url where we want to POST
        data: data,
        dataType: 'json', // what type of data do we expect back from the server
        // encode          : true
    }).done(function (data) {
        try {
            data = data["res"]
            console.log("load_trade_history_order_realtime"+JSON.stringify(data))
            if (data.status == 1 && data.all_report.length > 0) {
                $('#table_trade_history_realtime > tbody').html("")
                var tmp = data.all_report.length > Util.NUMBER_ORDER_SHOW_TRADE_HISTORY ? data.all_report.length - Util.NUMBER_ORDER_SHOW_TRADE_HISTORY : 0
                update_current_value({ "current_value": data.all_report[0]["Price"] })
                for (var i = data.all_report.length - 1; i >= tmp; i--) {
                    try {
                        var item = {
                            'side': data['all_report'][i]['Side'],
                            'price': data['all_report'][i]['Price'],
                            'amount': data['all_report'][i]['OrderQty'],
                            'time': (data['all_report'][i]['TransactTime'].split(" ")[3])
                        }
                        
                        $('#table_trade_history_realtime > tbody').prepend(Util.trade_history_realtime(item))
                    } catch (error) {
                        console.log(error)
                    }
                }
            } else {
                console.log("all report null ")
                $('#table_trade_history_realtime > tbody').html(`<div><center><h6>No Order</h6></center></div>`)
            }
        } catch (error) {
            console.log(error)
        }

    });
}
function update_trade_history_order_realtime(data) {
    var item = {
        'side': data['order']['Side'],
        'price': Util.format_number_to_show(data['order']['Price']),
        'amount': Util.format_number_to_show(data['order']['OrderQty']),
        'symbol': data['order']['Symbol']
    }
    var item2 = {
        'side': data['order']['Side'] == "Buy" ? "Sell" : "Buy",
        'price': Util.format_number_to_show(data['order']['Price']),
        'amount': Util.format_number_to_show(data['order']['OrderQty']),
        'symbol': data['order']['Symbol']
    }
    // console.log("update_trade_history_otc ===== item ======" +JSON.stringify(item))

    $('#table_trade_history > tbody').prepend(Util.trade_history_otc(item2))
    $('#table_trade_history > tbody> tr').eq(Util.NUMBER_ORDER_SHOW_TRADE_HISTORY).children('td').remove();
    $('#table_trade_history > tbody').prepend(Util.trade_history_otc(item))
    $('#table_trade_history > tbody> tr').eq(Util.NUMBER_ORDER_SHOW_TRADE_HISTORY).children('td').remove();
    // $('')
}
var Realtime_market = {
    reload_bid_ask_and_my_order_realtime: function reload_bid_ask_and_my_order_realtime(is_show_effect) {
        console.log("reload_bid_ask_and_my_order")
        var pair = localStorage.getItem("pair").split('-')
        try {
            var symbol = pair[0].toUpperCase() + "/" + pair[1].toUpperCase();

            var data = {
                'Symbol': symbol,
                "type_trade": "ECN"
            }
            $.ajax({
                headers: {
                    "x-access-token": localStorage.getItem("token")
                },
                url: '/api/trade/real-time-market/orders',
                type: 'POST',
                data: data,
                dataType: 'json',
                success: function (json) {
                    try {
                        console.log(json)
                        //update list bid
                        Util.list_bid = json['bid']
                        Util.old_list_bid = json['bid']
                        update_list_bid_realtime(Util.list_bid, is_show_effect)
                        //update list ask
                        Util.list_ask = json['ask']
                        Util.old_list_ask = json['ask']
                        update_list_ask_realtime(Util.list_ask, is_show_effect)
                        //update list my order
                        if (!json['is_guest']) {
                            Util.list_my_order = json['my-order']
                            update_list_my_order_realtime(Util.list_my_order)
                        } else {
                            var str = `<center><div class="s1lt5gnu-3 cjoFjw">
                                        <a style="color:#fd961a" onclick="getPage('/login')">Log in</a> or 
                                        <a style="color:#fd961a" onclick="getPage('/signup')">Register</a> to trade
                                    </div></center>`
                            $('#all-order-realtime > tbody').html(`<tr><td colspan = '6'>` + str + `</td></tr>`)
                        }
                    } catch (error) {
                        console.log(error)
                    }
                }
            });
        } catch (error) {
            console.log("reload_bid_ask_and_my_order fail " + error)
            return
        }
    }
}
$(document).ready(function (e) {
    Realtime_market.reload_bid_ask_and_my_order_realtime(false)
    load_trade_history_order_realtime()
    try {
        var socket = io({ path: '/order' });
        socket.on('response-list-order-realtime', function (data) {
            console.log("response-list-order-realtime " + JSON.stringify(data))
            if (data['status'] == 1) {
                var item = {
                    'current_price': data['order']['Price'],
                    // 'current_price_dolar': data['order']['Price']
                }
                update_current_value(item)
                Realtime_market.reload_bid_ask_and_my_order_realtime(true)
                return false
            }
        });

        socket.on('response-list-order-after-cancel-realtime', function (data) {
            if (data['status'] == 1) {
                update_after_cancel_order_realtime(data)
                return false
            }
        });
    } catch (error) {
        console.log(error)
    }
});

