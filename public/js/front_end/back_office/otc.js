function order_buy() {
    console.log("otc_order")
    // console.log("afdf = " + Math.floor(Math.random() * 100000))
    try {
        var amount = parseFloat($('#order_entry_amount_bid').val())
        var price = parseFloat($('#order_entry_price_bid').val())
        var total = parseFloat($('#order_entry_total_bid').val())
        var fee = parseFloat($('#order_entry_fee_buy').val())
        var avaiable_before = Util.fix_number(parseFloat(Util.format_number_to_calculate($('.avaiable_balance_buy').html())),5)
        var check = Util.check_validate_buy_coin(amount, price, total)
        if(check!=true){
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
            var html = `<button name="Buy" class="btn order-trade" onclick="confirm_order(${amount},${price},'${symbol}','${side}','${ordType}',${total})">Confirm</button>`
            $("#order_trade >.modal-dialog>.modal-content>.modal-footer >.order-trade ").remove()
            $("#order_trade >.modal-dialog>.modal-content>.modal-footer ").prepend(html)
            $("#info_order>tbody").html(feedContentOrder(amount, price, symbol, side,pair[0].toUpperCase(),pair[1].toUpperCase(),fee,avaiable_before))
            $("#order_trade").modal("show")
        } catch (error) {
            console.log("may be pair is null, error: " + error)
        }

    } catch (err) {
        console.log(err);
    }
}

function order_sell() {
    try {
        var amount = parseFloat($('#order_entry_amount_sell').val())
        var price = parseFloat($('#order_entry_price_sell').val())
        var total = parseFloat($('#order_entry_total_sell').val())
        var fee = parseFloat($('#order_entry_fee_sell').val())
        var avaiable_before = Util.fix_number(parseFloat(Util.format_number_to_calculate($('.avaiable_balance_sell').html())),5)

        var check = Util.check_validate_sell_coin(amount, price, total)
        if(check!=true){
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
            var html = `<button name="Buy" class="btn order-trade" onclick="confirm_order(${amount},${price},'${symbol}','${side}','${ordType}',${total})">Confirm</button>`
            $("#order_trade >.modal-dialog>.modal-content>.modal-footer >.order-trade ").remove()
            $("#order_trade >.modal-dialog>.modal-content>.modal-footer ").prepend(html)
            $("#info_order>tbody").html(feedContentOrder(amount, price, symbol, side,pair[0].toUpperCase(),pair[1].toUpperCase(),fee,avaiable_before))
            $("#order_trade").modal("show")
        } catch (error) {
            console.log("may be pair is null, error: " + error)
        }
    } catch (err) {
        console.log(err);
    }
}

function feedContentOrder(amount, price, symbol, side,symbol1,symbol2,fee,avaiable_before) {
    var pair= symbol.toLowerCase().replace('/','-')
    var symbol_avaiable = side=="Buy"?symbol2:symbol1
    var symbol_fee = side=="Buy"?symbol1:symbol2
    var really_received = side=="Buy"?Util.fix_number(parseFloat(amount)- parseFloat(fee),8)+" "+symbol_fee:Util.fix_number(parseFloat(amount*price)- parseFloat(fee),8)+" "+symbol_fee
    var html = `<tr>
                    <td>Your Avaiable</td>
                    <td>
                        <span class="bitex-model">${Util.format_number_to_show(avaiable_before)} ${symbol_avaiable}</span>
                    </td>
                </tr>
                <tr>
                    <td>Type Orders</td>
                    <td>
                        <span class="bitex-model">${side}</span>
                    </td>
                </tr>
                <tr>
                    <td>Your Orders</td>
                    <td>
                        <span class="bitex-model">${amount} ${symbol1}</span>
                    </td>
                </tr>
                <tr>
                    <td>Rate
                        <span id='symbol_order_buy'>${symbol}</span> on market
                    </td>
                    <td>
                        <span class="bitex-model">${localStorage.getItem("pair-"+pair)} (${symbol})</span>
                    </td>
                </tr>
                <tr>
                    <td>Price
                        <span id='symbol_order_buy'>${symbol}</span> by your order
                    </td>
                    <td>
                    <span class="bitex-model">${Util.format_number_to_show(price)} (${symbol})</span>
                    </td>
                </tr>
                <tr>
                    <td>Total</td>
                    <td>
                        <span class="bitex-model">${Util.format_number_to_show(Util.fix_number(parseFloat(amount * price),5))} ${symbol2} </span>
                    </td>
                </tr>
                <tr>
                    <td>Fee</td>
                    <td>
                        <span class="bitex-model">${Util.format_number_to_show(parseFloat(fee))} ${symbol_fee}</span>
                    </td>
                </tr>
                <tr style="font-weight: bolder">
                    <td>Really Received</td>
                    <td>
                        <span class="bitex-model">${Util.format_number_to_show(really_received)}</span>
                    </td>
                </tr>`
    return html;
}
function feedContentCancelOrder(OrderID,amount, price, symbol, side) {
    var pair= symbol.toLowerCase().replace('/','-')
    var tmp = symbol.split("/")
    var symbol1 = tmp[0].toUpperCase()
    var symbol2 = tmp[1].toUpperCase()
    var symbol_fee = side=="Buy"?symbol1:symbol2
    var fee = side =="Buy"? Util.fix_number(amount*Util.FEE_VALUE,8): Util.fix_number(amount*price*Util.FEE_VALUE,8)
    var really_received = side=="Buy"?Util.fix_number(parseFloat(amount)- parseFloat(fee),8)+" "+symbol_fee:Util.fix_number(parseFloat(amount*price)- parseFloat(fee),8)+" "+symbol_fee
    var html = `<tr>
                    <td>Order ID</td>
                    <td>
                        <span class="bitex-model">${OrderID}</span>
                    </td>
                </tr>
                
                <tr>
                    <td>Type Orders</td>
                    <td>
                        <span class="bitex-model">${side}</span>
                    </td>
                </tr>
                <tr>
                    <td>Your Orders</td>
                    <td>
                        <span class="bitex-model">${amount} ${symbol1}</span>
                    </td>
                </tr>
                <tr>
                    <td>Rate
                        <span id='symbol_order_buy'>${symbol}</span> on market
                    </td>
                    <td>
                        <span class="bitex-model">${localStorage.getItem("pair-"+pair)} (${symbol})</span>
                    </td>
                </tr>
                <tr>
                    <td>Price
                        <span id='symbol_order_buy'>${symbol}</span> by your order
                    </td>
                    <td>
                    <span class="bitex-model">${Util.format_number_to_show(price)} (${symbol})</span>
                    </td>
                </tr>
                <tr>
                    <td>Total</td>
                    <td>
                        <span class="bitex-model">${Util.format_number_to_show(Util.fix_number(parseFloat(amount * price),5))} ${symbol2} </span>
                    </td>
                </tr>
                <tr>
                    <td>Fee</td>
                    <td>
                        <span class="bitex-model">${Util.format_number_to_show(parseFloat(fee))} ${symbol_fee}</span>
                    </td>
                </tr>
                <tr style="font-weight: bolder">
                    <td>Really Received</td>
                    <td>
                        <span class="bitex-model">${Util.format_number_to_show(really_received)}</span>
                    </td>
                </tr>`
    return html;
}
function reset_input(Side,symbol){
    var pair= symbol.toLowerCase().replace('/','-')
    $(".input-"+Side).val(0.000000)
    $(".price-market-"+Side).val(localStorage.getItem("pair-"+pair))
}
function confirm_match_order(OrderQty, OrdType, Price, Side, symbol, OrderID, userOrder){
    $("#order_trade").modal("hide")

    var data = {
        'OrderQty': OrderQty,
        'OrdType': OrdType,
        'Price': Price,
        'Side': Side,
        'Symbol': symbol,
        'SecondaryOrderID': OrderID,
        'UserOrder': userOrder
    }
    var message = [":", Side, OrderQty, symbol.split('/')[0], "Price", Price].join(' ')
    console.log(message)
    console.log("order_directly = " + data)
    $.ajax({
        headers: {
            "x-access-token": localStorage.getItem("token")
        },
        url: '/api/trade/otc/order',
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function (json) {
            console.log(json)
            if (json.status == 0) {
                message = json.message
            } else {
                console.log(json["report"])
                // console.log(parseFloat(Util.format_number_to_calculate($('.avaiable_balance_buy').html())))
                // console.log(parseFloat(Util.format_number_to_calculate($('.avaiable_balance_sell').html())))
                if (Side == 'Buy') {
                    $('.avaiable_balance_buy').html(Util.format_number_to_show(((parseFloat(Util.format_number_to_calculate($('.avaiable_balance_buy').html()))  - json["report"]["AllocQty"] ).toFixed(5))))
                    $('.avaiable_balance_sell').html(Util.format_number_to_show(((parseFloat(Util.format_number_to_calculate($('.avaiable_balance_sell').html())) + json["report"]["OrderQty"]).toFixed(5))))
                } else {
                    
                    $('.avaiable_balance_buy').html(Util.format_number_to_show(((parseFloat(Util.format_number_to_calculate($('.avaiable_balance_buy').html())) + json["report"]["AllocQty"]).toFixed(5))))
                    $('.avaiable_balance_sell').html(Util.format_number_to_show(((parseFloat(Util.format_number_to_calculate($('.avaiable_balance_sell').html())) - json["report"]["OrderQty"]).toFixed(5))))
                }
                $(".avaiable_balance_buy").addClass('balance-info-blink');
                $(".avaiable_balance_sell").addClass('balance-info-blink');
                // console.log(parseFloat(Util.format_number_to_calculate($('.avaiable_balance_buy').html())))
                // console.log(parseFloat(Util.format_number_to_calculate($('.avaiable_balance_sell').html())))

                setTimeout(function () {

                    $(".avaiable_balance_buy").removeClass('balance-info-blink');

                    $(".avaiable_balance_sell").removeClass('balance-info-blink');
                }, 500);
            }
            notify_order(json, message)
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);

        }
    });
}



function order_directly(OrderQty, OrdType, Price, Side, symbol, OrderID, userOrder) {
    var html;
    console.log("order_directly")

    if(!(localStorage.getItem("token")!=null && localStorage.getItem("token").length >100)){
        Util.notify_order_invalid("Log in or Register to trade")
        return
    }
 

    if(Side =="Buy")  html = `<button name="Buy" class="btn order-trade" onclick="confirm_match_order(${OrderQty},'${OrdType}',${Price},'${Side}','${symbol}','${OrderID}',${userOrder})">Confirm</button>`
    else html = `<button name="Sell" class="btn order-trade" onclick="confirm_match_order(${OrderQty},'${OrdType}',${Price},'${Side}','${symbol}','${OrderID}',${userOrder})">Confirm</button>`
    $("#order_trade >.modal-dialog>.modal-content>.modal-footer >.order-trade ").remove()
    $("#order_trade >.modal-dialog>.modal-content>.modal-footer ").prepend(html)
    var avaiable_before = Util.fix_number(parseFloat(Util.format_number_to_calculate($('.avaiable_balance_sell').html())),5)
    var pair = symbol.split('/')
    var fee = Side =="Buy"? Util.fix_number(OrderQty*Util.FEE_VALUE,8): Util.fix_number(OrderQty*Price*Util.FEE_VALUE,8)
    $("#info_order>tbody").html(feedContentOrder(OrderQty, Price, symbol, Side,pair[0],pair[1],fee,avaiable_before ))
    $("#order-title").html("Matching directly!")
    $("#order_trade").modal("show")
}

function api_create_otc_order(amount, price, symbol, side, ordType) {
    $("#order_trade").modal("hide")

    var data = {
        'OrderQty': amount,
        'OrdType': ordType,
        'Price': price,
        'Side': side,
        'Symbol': symbol,
    }
    var message = [":", side, amount, symbol.split('/')[0], "Price", price].join(' ')
    console.log(message)
    $.ajax({
        headers: {
            "x-access-token": localStorage.getItem("token")
        },
        url: '/api/trade/otc/order',
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
                setTimeout(function () {
                    $("#locked_buy_account").removeClass('balance-info-blink');
                    $(".avaiable_balance_buy").removeClass('balance-info-blink');
                    $("#locked_sell_account").removeClass('balance-info-blink');
                    $(".avaiable_balance_sell").removeClass('balance-info-blink');
                }, 500);

            }
            reset_input(side,symbol);
            notify_order(json, message)
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function confirm_cancel_order(ClOrdID, symbol, Side, OrderID, UserCancel){
    $("#order_trade").modal("hide")
    var data = {
        'ClOrdID': ClOrdID,
        'Symbol': symbol,
        "Side": Side,
        "OrderID": OrderID,
        "UserID": UserCancel
    }
    $.ajax({
        headers: {
            "x-access-token": localStorage.getItem("token")
        },
        url: '/api/trade/otc/cancel-order',
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function (json) {
            // console.log("call_api_cancel_order" + json)
            notify_cancel_order(json)
        }
    });
}

function cancel_order(ClOrdID, symbol, Side, OrderID, UserCancel, Price,OrderQty) {
    html = `<button name="Cancel" class="btn order-trade" onclick="confirm_cancel_order('${ClOrdID}','${symbol}','${Side}','${OrderID}',${UserCancel})">Confirm</button>`
    $("#order_trade >.modal-dialog>.modal-content>.modal-footer >.order-trade ").remove()
    $("#order_trade >.modal-dialog>.modal-content>.modal-footer ").prepend(html)
    $("#info_order>tbody").html(feedContentCancelOrder(OrderID,OrderQty, Price, symbol, Side))
    $("#order-title").html("Warning ! Cancel order")
    $("#order_trade").modal("show")
}

function confirm_order(amount, price, symbol, side, ordType, total) {
    var check = Util.check_validate_buy_coin(amount, price, total)
    if (check != true) {
        Util.notify_status_order(false, '', Math.floor(Math.random() * 1000000), '')
    } else api_create_otc_order(amount, price, symbol, side, ordType);
}

function notify_cancel_order(data) {
    console.log("notify_cancel_order")
    console.log(data)
    if (data['status'] == 1) {
        Util.notify_status_order(true, 'Canceled', data['report']['OrderID'], '')

        console.log('#my_order_' + data['report']['OrderID'])
        $('#my_order_' + data['report']['OrderID']).remove()
        
        if (data['report']['Side'] == 'Buy') {

            $('.avaiable_balance_buy').html((parseFloat(Util.format_number_to_calculate($('.avaiable_balance_buy').html())) + parseFloat(data["cancel_report"]["OrderQty"])*parseFloat(data["cancel_report"]["Price"])).toFixed(5))
            if(parseFloat(Util.format_number_to_calculate($('#locked_buy_account').html())) != 0)
                $('#locked_buy_account').html((parseFloat(Util.format_number_to_calculate($('#locked_buy_account').html())) - parseFloat(data["cancel_report"]["OrderQty"])).toFixed(5))
    
        } else {
            $('.avaiable_balance_sell').html((parseFloat(Util.format_number_to_calculate($('.avaiable_balance_sell').html())) + parseFloat(data["cancel_report"]["OrderQty"])).toFixed(5))
            if(parseFloat(Util.format_number_to_calculate($('#locked_buy_account').html())) != 0)
                $('#locked_sell_account').html((parseFloat(Util.format_number_to_calculate($('#locked_sell_account').html())) - parseFloat(data["cancel_report"]["OrderQty"])).toFixed(5))
    
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

function notify_order(json, message) {
    console.log(JSON.stringify(json))
    if (json.status == 1) {
        $("#all-order > tbody >tr>td >center").parent().remove()
        Util.notify_status_order(true, json['report']['Side'], json['report']['OrderID'], message)
        
        var strVar = `<tr class="order-manager-new" id="my_order_${json['report']['OrderID']}">
            <td class="order-manager-order-date">${formatDate(json['report']['TransactTime'])}</td>
            
            <td class="order-manager-description">${json['report']['Side']}ing ${Util.format_number_to_show(json['report']['OrderQty'])} ${json['report']['Symbol'].split('/')[0]}</td>
            
            
            <td class="order-manager-status">${json['report']['OrdStatus']}</td>
            <td class="order-manager-avg-price">${Util.format_number_to_show(json['report']['Price'])}</td>
            <td class="order-manager-volume">${Util.format_number_to_show(parseFloat(json['report']['OrderQty'] * json['report']['Price'] ).toFixed(5))}</td>
            <td class="order-manager-actions">
                <button class="btn btn-sm btn-danger" onclick="cancel_order('${json['report']['ClOrdID']}','${json['report']['Symbol']}','${json['report']['Side']}','${json['report']['OrderID']}',${json['report']['UserID']},${json['report']['Price']},${json['report']['OrderQty']})">cancel</button>
            </td>
        </tr>`
        $("#all-order > tbody").prepend(strVar)
    } else if (json.status == 2) {
        $("#all-order > tbody >tr>td >center").parent().remove()
        Util.notify_status_order(true, json['report']['Side'], json['report']['OrderID'], ": Order execution complete")

        //update list 
        var strVar =
            `<tr class="order-manager-new" id="my_order_${json['report']['OrderID']}">
                <td class="order-manager-order-date">${formatDate(json['report']['TransactTime'])}</td>
                <td class="order-manager-description">${json['report']['Side']} ${Util.format_number_to_show(json['report']['OrderQty'])} ${json['report']['Symbol'].split('/')[0]}</td>
                <td class="order-manager-status">${json['report']['OrdStatus']}</td>
                <td class="order-manager-avg-price">${Util.format_number_to_show(json['report']['Price'])}</td>
                <td class="order-manager-volume">${Util.format_number_to_show(parseFloat(json['report']['OrderQty'] * json['report']['Price'] ).toFixed(5))}</td>
                <td class="order-manager-actions">
                    Completed
                </td>
            </tr>`
        $("#all-order > tbody").prepend(strVar)
    } else {
        Util.notify_status_order(false, '', Math.floor(Math.random() * 1000000), message)
    }
}

function update_list_ask(listAsk) {
    console.log("update_list_ask")
    var str_ask = ""
    if (listAsk.length > 0) {
        
        Util.sort_list_order(listAsk, "DESC")
        listAsk.forEach(order => {   
            var btn = `<button class="btn btn-default" style="padding: 2px 5px" onclick="order_directly(${order['OrderQty']},'${order['OrdType']}',${order['Price']},'Buy','${order['Symbol']}','${order['OrderID']}','${order['UserID']}')">Buy</button>`
            str_ask += `<tr class="otc-row otc-movable otc-source otc-target">
                <td style="width: 30%;color: rgb(236, 83, 83)" class="otc-price-ask">${Util.format_number_to_show(order['Price'])}</td>
                <td style="width: 20%" class="otc-price-ask">${Util.format_number_to_show(parseFloat(order['OrderQty']))}</td>
                <td class="otc-price-ask">${order["DisplayName"]}</td>
                <td class="otc-price-ask">${order["ExecStyle"]}</td>
                <td class="otc-price-ask">${formatDate(order['TransactTime'])}</td>
                <td style="width: 10%" class="otc-price-ask">
                    ${btn}
                </td>
            </tr>`
        });
        $('#table_ask_otc > tbody').html(str_ask)
    } else {
        $('#table_ask_otc > tbody').html(`<tr><td colspan = '6'><center><h6>No Order</h6></center></td></tr>`)
    }
}

function update_list_bid(listBid) {
    console.log("update_list_bid")
    var str_bid = ""
    if (listBid.length > 0) {
        Util.sort_list_order(listBid, "DESC")
        listBid.forEach(order => {
            str_bid += `<tr class="otc-row otc-movable otc-source otc-target">
                    <td style="width: 30%;color: rgb(117, 226, 74)" class="otc-price-bid">${Util.format_number_to_show(order['Price'])}</td>
                    <td style="width: 20%" class="otc-price-bid">${Util.format_number_to_show(parseFloat(order['OrderQty']))}</td>
                    <td class="otc-price-bid">${order["DisplayName"]}</td>
                    <td class="otc-price-bid">${order["ExecStyle"]}</td>
                    <td class="otc-price-bid">${formatDate(order['TransactTime'])}</td>
                    <td style="width: 10%" class="otc-price-bid">
                        <button class="btn btn-default" style="padding: 2px 5px" onclick="order_directly(${order['OrderQty']},'${order['OrdType']}',${order['Price']},'Sell','${order['Symbol']}','${order['OrderID']}','${order['UserID']}')">Sell</button>
                    </td>
                </tr>`
        });
        $('#table_bid_otc > tbody').html(str_bid)
    } else {
        $('#table_bid_otc > tbody').html(`<tr><td colspan = '6'><center><h6>No Order</h6></center></td></tr>`)
    }
}

function update_list_my_order(listMyOrder) {
    console.log("update_list_my_order")
    // console.log(listMyOrder)
    if (listMyOrder.length > 0) {
        Util.sort_to_time(listMyOrder)
        var str_my_order = ""
        listMyOrder.forEach(order => {
            var type_order_status = ""
            var type_order_class = "order-manager-"
            var type_order_action = ""
            var type_currency_total = ""
            if(order['Side'] == "Sell"){
                type_currency_total = order['AllocSettlCurrency']
            }else{
                type_currency_total = order['Currency']
            }
            if (order['OrdStatus'] == "New") {
                type_order_status = 'Watting'
                type_order_class += 'new'
                type_order_action = `<button class="btn btn-sm btn-danger" onclick="cancel_order('${order['ClOrdID']}','${order['Symbol']}','${order['Side']}','${order['OrderID']}',${order['UserID']},${order['Price']},${order['OrderQty']})">cancel</button>`

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
                <td class="order-manager-order-date">${formatDate(order['TransactTime'])}</td>
                <td class="order-manager-description">${order['Side']}ing ${Util.format_number_to_show(order['OrderQty'])} ${order['Symbol'].split("/")[0]}</td>
                <td class="order-manager-status">${type_order_status}</td>
                <td class="order-manager-avg-price">${Util.format_number_to_show(order['Price'])} ${order['Symbol']}</td>
                <td class="order-manager-volume">${Util.format_number_to_show(parseFloat(order['Price'] * order['OrderQty']).toFixed(5))} ${type_currency_total}</td>
                <td class="order-manager-actions">${type_order_action}
                </td>
            </tr>`
        });
        $('#all-order > tbody').html(str_my_order)
    } else {
        $('#all-order > tbody').html(`<tr><td colspan = '6'><center><h6>No Order</h6></center></td></tr>`)
    }
}



function update_after_new_order(data) {
    console.log("update_after_new_order")
    try {
        if (data['order']['OrdStatus'] == "New") {
            if (data['order']['Side'] == "Sell") {
                Util.list_ask.push(data['order'])
                update_list_ask(Util.list_ask)
            } else {
                Util.list_bid.push(data['order'])
                update_list_bid(Util.list_bid)
            }
        }
    } catch (error) {
        console.log("update_after_new_order error" + error)
    }
}

function update_after_cancel_order(data) {
    console.log("update_after_cancel_order")
    try {
        if (data['order']['OrdStatus'] == "Canceled") {

            if (data['order']['Side'] == "Sell") {
                var i = 0
                Util.list_ask.forEach(element => {
                    if (element['OrderID'] == data['order']['OrderID']) {
                        Util.list_ask.splice(i, 1)
                    }
                    i++;
                });
                update_list_ask(Util.list_ask)
            } else {
                var i = 0
                Util.list_bid.forEach(element => {
                    if (element['OrderID'] == data['order']['OrderID']) {
                        Util.list_bid.splice(i, 1)
                    }
                    i++;
                });
                update_list_bid(Util.list_bid)
            }
        }
    } catch (error) {
        console.log("update_after_new_order error" + error)
    }
}

function update_order_matching_completed(data) {
    console.log("update_order_matching_completed")
    console.log(data)
    try {
        if (data['order']['OrdStatus'] == "Filled") {
            if (data['order']['Side'] == "Sell") {
                console.log(Util.list_bid)
                var i = 0
                Util.list_bid.forEach(element => {
                    if (element['OrderID'] == data['order']['SecondaryOrderID']) {
                        Util.list_bid.splice(i, 1)
                    }
                    i++;
                });
                update_list_bid(Util.list_bid)
            } else {
                var i = 0
                console.log(Util.list_ask)
                Util.list_ask.forEach(element => {
                    if (element['OrderID'] == data['order']['SecondaryOrderID']) {
                        Util.list_ask.splice(i, 1)
                    }
                    i++;
                });
                update_list_ask(Util.list_ask)
            }
            //update list my order
            console.log(Util.list_my_order)
            console.log(data['order']['SecondaryOrderID'])
            Util.list_my_order.forEach(element => {
                console.log('#my_order_' + data['order']['SecondaryOrderID'])

                if (element['OrderID'] == data['order']['SecondaryOrderID']) {
                    console.log(data['order'])
                    $('#my_order_' + data['order']['SecondaryOrderID']).removeClass('order-manager-new')
                    $('#my_order_' + data['order']['SecondaryOrderID']).addClass('order-manager-fill')
                    $('#my_order_' + data['order']['SecondaryOrderID'] + ' > .order-manager-status').html("Success")
                    $('#my_order_' + data['order']['SecondaryOrderID'] + ' > .order-manager-actions').html("Completed")
                    if (data['order']["Side"] == 'Sell') {
                        $('.avaiable_balance_sell').html((parseFloat(Util.format_number_to_calculate($('.avaiable_balance_sell').html())) + data['order']["OrderQty"]).toFixed(5))
                        $(".avaiable_balance_sell").addClass('balance-info-blink');

                    } else {
                        $('.avaiable_balance_buy').html((parseFloat(Util.format_number_to_calculate($('.avaiable_balance_buy').html())) + data['order']["AllocQty"]).toFixed(5))
                        $(".avaiable_balance_buy").addClass('balance-info-blink');


                    }
                    setTimeout(function () {
    
                        $(".avaiable_balance_buy").removeClass('balance-info-blink');
    
                        $(".avaiable_balance_sell").removeClass('balance-info-blink');
                    }, 500);
                   
                    Util.notify_status_order(true, data['order']['Side'], data['order']['SecondaryOrderID'], ": Order execution complete")
                    return false;
                }
            })


        }
    } catch (error) {
        console.log("update_order_matching_completed error" + error)
    }
}
function load_trade_history_otc(){
    console.log("load_trade_history_otc")
    $.ajax({
        type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
        url: '/api/trade/otc/top-trade-history-otc', // the url where we want to POST

        dataType: 'json', // what type of data do we expect back from the server
        // encode          : true
    }).done(function (data) {
        data = data["res"]
        console.log("load_trade_history_otc "+JSON.stringify(data))
        // data = JSON.parse(data)
        if (data.status == 1) {
            $('#table_trade_history > tbody').html("")
            var tmp = data.all_report.length>Util.NUMBER_ORDER_SHOW_TRADE_HISTORY?data.all_report.length-Util.NUMBER_ORDER_SHOW_TRADE_HISTORY:0

            for (var i = data.all_report.length - 1; i >= tmp; i--) {
                console.log("i = "+i)
                try {
                    var item = {
                        'side':data['all_report'][i]['Side'],
                        'price':data['all_report'][i]['Price'],
                        'amount':data['all_report'][i]['OrderQty'],
                        'symbol':data['all_report'][i]['Symbol']
                    }
                    $('#table_trade_history > tbody').prepend(Util.trade_history_otc(item))
                } catch (error) {
                    console.log(error)
                }
            }
        }

    });
}

function update_trade_history_otc(data){
    // console.log("update_trade_history_otc"+JSON.stringify(data))
    var item = {
        'side':data['order']['Side'],
        'price':Util.format_number_to_show(data['order']['Price']),
        'amount':Util.format_number_to_show(data['order']['OrderQty']),
        'symbol':data['order']['Symbol']
    }
    var item2 = {
        'side':data['order']['Side']=="Buy"?"Sell":"Buy",
        'price':Util.format_number_to_show(data['order']['Price']),
        'amount':Util.format_number_to_show(data['order']['OrderQty']),
        'symbol':data['order']['Symbol']
    }
    // console.log("update_trade_history_otc ===== item ======" +JSON.stringify(item))
    
    $('#table_trade_history > tbody').prepend(Util.trade_history_otc(item2))
    $('#table_trade_history > tbody> tr').eq(Util.NUMBER_ORDER_SHOW_TRADE_HISTORY).children('td').remove();
    $('#table_trade_history > tbody').prepend(Util.trade_history_otc(item))
    $('#table_trade_history > tbody> tr').eq(Util.NUMBER_ORDER_SHOW_TRADE_HISTORY).children('td').remove();
    // $('')
}

var OTC = {
    reload_bid_ask_and_my_order: function reload_bid_ask_and_my_order() {
        console.log("reload_bid_ask_and_my_order")
        var pair = localStorage.getItem("pair").split('-')
        try {
            var symbol = pair[0].toUpperCase() + "/" + pair[1].toUpperCase();

            var data = {
                'Symbol': symbol
            }
            $.ajax({
                headers: {
                    "x-access-token": localStorage.getItem("token")
                },
                url: '/api/trade/otc/orders',
                type: 'POST',
                data: data,
                dataType: 'json',
                success: function (json) {
                    console.log(json)
                    //update list bid
                    Util.list_bid = json['bid']
                    update_list_bid(Util.list_bid)
                    //update list ask
                    Util.list_ask = json['ask']
                    update_list_ask(Util.list_ask)
                    //update list my order
                    if(!json['is_guest']){
                        Util.list_my_order = json['my-order']
                        update_list_my_order(Util.list_my_order)
                    }else{
                        var str= `<center><div class="s1lt5gnu-3 cjoFjw">
                                    <a style="color:#fd961a" onclick="getPage('/login')">Log in</a> or 
                                    <a style="color:#fd961a" onclick="getPage('/signup')">Register</a> to trade
                                </div></center>`
                        $('#all-order > tbody').html(`<tr><td colspan = '6'>`+str+`</td></tr>`)
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

    load_trade_history_otc()
    try {
        var socket = io({path: '/order'});
        socket.on('response-list-order', function (data) {
                    
            if (data['status'] == 1) {
                update_after_new_order(data)
                return false
            }
        });
        socket.on('response-list-order-matching', function (data) {
            
            try {
                update_order_matching_completed(data)
                update_trade_history_otc(data)
                Util.update_total_daily_transaction();
                return false
            } catch (error) {
                console.log("error =" + error)
            }
        });

        socket.on('response-list-order-after-cancel', function (data) {
            
            update_after_cancel_order(data)
            return false
        });
    }catch(error){

    }
});
