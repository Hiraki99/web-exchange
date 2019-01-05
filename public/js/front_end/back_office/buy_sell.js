function setPriceBuySellBTCETH(){
    console.log("setPriceBuySellBTCETH")
}
function setPriceBuySellBTCUSDT(){
    console.log("setPriceBuySellBTCUSDT")
    
}
function setPriceBuySellETHUSDT(){
    console.log("setPriceBuySellETHUSDT")
    
}
function amountBuy() {
    try {
        var fix_amount = 2
        var fix_price = 5
        var fix_total = 8
        var price = parseFloat($('#order_entry_price').val())
        var total = parseFloat($('#order_entry_total').val())
        var amount = parseFloat($('#order_entry_qty').val())
        if (total < 0) {
            total = 0;
            $('#order_entry_total').val(0)
        }
        if (price < 0) {
            price = 0;
            $('#order_entry_price').val(0)
        }
        if (amount < 0) {
            amount = 0;
            $('#order_entry_qty').val(0)
        }
        amount = fix_number($('#order_entry_qty').val(), fix_amount)
        $('#order_entry_qty').val(amount)

        if (($('#order_entry_price').val())) {
            console.log("price = "+price )
            console.log("amount = "+amount)
            console.log("total = "+(price*amount).toFixed(fix_total))
            $('#order_entry_total').val(fix_number((price*amount).toFixed(fix_total), fix_total))
        } else {
            if (($('#order_entry_total').val()) && !($('#order_entry_price').val())) {
                $('#order_entry_price').val(fix_number(total / amount, fix_price))
            }
        }
    } catch (error) {
        console.log(error);
    }
}
function priceBuy() {
    try {
        var fix_amount = 2
        var fix_price = 5
        var fix_total = 8
        var price = parseFloat($('#order_entry_price').val())
        var total = parseFloat($('#order_entry_total').val())
        var amount = parseFloat($('#order_entry_qty').val())
        if (total < 0) {
            total = 0;
            $('#order_entry_total').val(0)
        }
        if (price < 0) {
            price = 0;
            $('#order_entry_price').val(0)
        }
        if (amount < 0) {
            amount = 0;
            $('#order_entry_qty').val(0)
        }
        price = fix_number($('#order_entry_price').val(), fix_price)
        $('#order_entry_price').val(price)

        if (($('#order_entry_qty').val())) {
            $('#order_entry_total').val(fix_number((price*amount).toFixed(fix_total), fix_total))
        } else {
            if (!($('#order_entry_qty').val()) && ($('#order_entry_total').val())) {
                $('#order_entry_qty').val(fix_number(total / price, fix_amount))
            }
        }
    } catch (error) {
        console.log(error);
    }
}


function totalBuy() {
    try {
        var fix_amount = 2
        var fix_price = 5
        var fix_total = 8
        var price = parseFloat($('#order_entry_price').val())
        var total = parseFloat($('#order_entry_total').val())
        var amount = parseFloat($('#order_entry_qty').val())
        if (total < 0) {
            total = 0;
            $('#order_entry_total').val(0)
        }
        if (price < 0) {
            price = 0;
            $('#order_entry_price').val(0)
        }
        if (amount < 0) {
            amount = 0;
            $('#order_entry_qty').val(0)
        }
        total = fix_number($('#order_entry_total').val(), fix_total)
        $('#order_entry_total').val(total)
        // price = fix_number($('#order_entry_price').val(), fix_price)
        // $('#order_entry_price').val(price)
        // amount = fix_number($('#order_entry_qty').val(), fix_amount)
        // $('#order_entry_qty').val(amount)

        if (($('#order_entry_price').val())) {
            $('#order_entry_qty').val(fix_number(total / price, fix_amount))
        } else {
            if (($('#order_entry_qty').val()) && !($('#order_entry_price').val())) {
                $('#order_entry_price').val(fix_number(total / amount, fix_price))
            }
        }
    } catch (error) {
        console.log(error);
    }
}

function amountSell() {
    try {
        var fix_amount = 2
        var fix_price = 5
        var fix_total = 8
        var price = parseFloat($('#order_entry_price_sell').val())
        var total = parseFloat($('#order_entry_total_sell').val())
        var amount = parseFloat($('#order_entry_amount_sell').val())
        if (total < 0) {
            total = 0;
            $('#order_entry_total_sell').val(0)
        }
        if (price < 0) {
            price = 0;
            $('#order_entry_price_sell').val(0)
        }
        if (amount < 0) {
            amount = 0;
            $('#order_entry_amount_sell').val(0)
        }
        amount = fix_number($('#order_entry_amount_sell').val(), fix_amount)
        $('#order_entry_amount_sell').val(amount)

        if (($('#order_entry_price_sell').val())) {
            $('#order_entry_total_sell').val(fix_number((price*amount).toFixed(fix_total), fix_total))
        } else {
            if (($('#order_entry_total_sell').val()) && !($('#order_entry_price_sell').val())) {
                $('#order_entry_price_sell').val(fix_number(total / amount, fix_price))
            }
        }
    } catch (error) {
        console.log(error);
    }
}
function priceSell() {
    try {
        var fix_amount = 2
        var fix_price = 5
        var fix_total = 8
        var price = parseFloat($('#order_entry_price_sell').val())
        var total = parseFloat($('#order_entry_total_sell').val())
        var amount = parseFloat($('#order_entry_amount_sell').val())
        if (total < 0) {
            total = 0;
            $('#order_entry_total_sell').val(0)
        }
        if (price < 0) {
            price = 0;
            $('#order_entry_price_sell').val(0)
        }
        if (amount < 0) {
            amount = 0;
            $('#order_entry_amount_sell').val(0)
        }
        price = fix_number($('#order_entry_price_sell').val(), fix_price)
        $('#order_entry_price_sell').val(price)

        if (($('#order_entry_amount_sell').val())) {
            $('#order_entry_total_sell').val(fix_number((price*amount).toFixed(fix_total), fix_total))
        } else {
            if (!($('#order_entry_amount_sell').val()) && ($('#order_entry_total_sell').val())) {
                $('#order_entry_amount_sell').val(fix_number(total / price, fix_amount))
            }
        }
    } catch (error) {
        console.log(error);
    }
}
function totalSell() {
    try {
        var fix_amount = 2
        var fix_price = 5
        var fix_total = 8
        var price = parseFloat($('#order_entry_price_sell').val())
        var total = parseFloat($('#order_entry_total_sell').val())
        var amount = parseFloat($('#order_entry_amount_sell').val())
        if (total < 0) {
            total = 0;
            $('#order_entry_total_sell').val(0)
        }
        if (price < 0) {
            price = 0;
            $('#order_entry_price_sell').val(0)
        }
        if (amount < 0) {
            amount = 0;
            $('#order_entry_qty').val(0)
        }
        total = fix_number($('#order_entry_total_sell').val(), fix_total)
        $('#order_entry_total_sell').val(total)
        // price = fix_number(price, fix_price)
        // $('#order_entry_price_sell').val(price)
        // amount = fix_number(amount, fix_amount)
        // $('#order_entry_qty').val(amount)

        if (($('#order_entry_price_sell').val())) {
            $('#order_entry_amount_sell').val(fix_number(total / price, fix_amount))
        } else {
            if (($('#order_entry_amount_sell').val()) && !($('#order_entry_price_sell').val())) {
                $('#order_entry_price_sell').val(fix_number(total / amount, fix_price))
            }
        }
    } catch (err) {
        console.log(err);
    }
}
function buy_btc(e) {
    try {
        $("#buy-btc > .modal-dialog > .modal-content > .modal-footer > button[name='deposit']").remove()
        var strVar = "<button name=\"deposit\" class=\"btn btn-primary\" onclick='order_buy_btc()'>Deposit<\/button>";
        $("#buy-btc >.modal-dialog > .modal-content> .modal-footer").prepend(strVar);
        var amount, total, price;
        if ($("#order_entry_advanced").attr('style') != "display: block;") {
            amount = parseFloat($('#order_entry_qty').val())
            total = amount
            price = total
        } else {
            amount = parseFloat($('#order_entry_amount').val())
            price = parseFloat($('#order_entry_price').val())
            total = amount * price;
        }
        console.log("amount = " + amount)
        console.log("price = " + price)
        var check = check_validate_buy_coin(amount, price, total);
        if (check != true) {
            console.log("check = " + check)
            notify_small_fail(id_notifi += 1, check)
            return
        }

        $("#amount_account_buy").html(amount)
        $("#amount_order_buy").html(total)
        $('#amount_avaiable_buy').html(parseFloat($("#total_amount_avaiable").data('amount')) - total);

        $("#buy-btc").modal()
        $('body').css("padding-right", "0px !important");


    }
    catch (err) {
        console.log(err);
    }
}

function order_buy_btc() {
    var amount, total, price;
    if ($("#order_entry_advanced").attr('style') != "display: block;") {
        amount = parseFloat($('#order_entry_qty').val())
        total = amount
        price = total
    } else {
        amount = parseFloat($('#order_entry_amount').val())
        price = parseFloat($('#order_entry_price').val())
        total = amount * price;
    }

    id_notifi += 1
    var strVar = "";
    strVar += "<tr class=\"order-manager-new\" id=\"" + id_notifi + "\">";
    strVar += "                                        <td class=\"order-manager-order-date\">" + formatDate(Date.now()) + "<\/td>";
    strVar += "                                        <td class=\"order-manager-description\">Buying ฿ " + amount + "<\/td>";
    strVar += "                                        <td class=\"order-manager-status\">Waiting sellers<\/td>";
    strVar += "                                        <td class=\"order-manager-avg-price\">$ " + price + "<\/td>";
    strVar += "                                        <td class=\"order-manager-volume\">$ " + (total).toFixed(2) + "<\/td>";
    strVar += "                                        <td class=\"order-manager-actions\">";
    strVar += "                                            <button class=\"btn btn-sm btn-danger\" data-action=\"cancel\" onclick='cancel_transaction(this)'";
    strVar += "                                                data-order-id=\"" + id_notifi + "\">cancel<\/button>";
    strVar += "                                        <\/td>";
    strVar += "                                    <\/tr>";

    $("#all-order >tbody").prepend(strVar);
    $("#buy-btc").modal('toggle')

    notify_small_order(id_notifi);
    var data = {
        "order-id": id_notifi,
        'amount': amount,
        'price': total,
        'type': 'buy',
        "time": Date.now()
    }
    allNewOrderBuy.push(data);
    localStorage.allNewOrderBuy = JSON.stringify(allNewOrderBuy);
    //send request
    //fake
    var fee = 0.0001
    var type = "Normal"
    var side = "Buyer"
    var symbol = "BTC"
    call_api_buy_coin(amount, price, total, symbol, side, type, fee, false,1);
}

function sell_btc(e) {
    try {
        $("#buy-btc > .modal-dialog > .modal-content > .modal-footer > button[name='deposit']").remove()
        var strVar = "<button name=\"deposit\" class=\"btn btn-primary\" onclick='order_sell_btc()'>Sell 500 ₫<\/button>";
        $("#buy-btc >.modal-dialog > .modal-content> .modal-footer").prepend(strVar);
        var amount, total, price;
        if ($("#order_entry_advanced_sell").attr('style') != "display: block;") {
            amount = parseFloat($('#order_entry_qty_sell').val())
            total = amount
            price = total
        } else {
            amount = parseFloat($('#order_entry_amount_sell').val())
            price = parseFloat($('#order_entry_price_advanced_sell').val())
            total = amount * price;
        }

        var check = check_validate_sell_coin(amount, price, total);
        if (check != true) {
            console.log("check = " + check)
            notify_small_fail(id_notifi += 1, check)
            return
        }
        $("#amount_account_buy").html(amount)
        $("#amount_order_buy").html(total)
        $('#amount_avaiable_buy').html(parseFloat($("#total_amount_avaiable").data('amount')) + total);
        $("#buy-btc").modal()
        $('body').css("padding-right", "0px !important");

    }
    catch (err) {
        console.log(err);
    }
}

function order_sell_btc() {
    var amount, total, price;
    if ($("#order_entry_advanced_sell").attr('style') != "display: block;") {
        amount = parseFloat($('#order_entry_qty_sell').val())
        total = amount
        price = total
    } else {
        amount = parseFloat($('#order_entry_amount_sell').val())
        price = parseFloat($('#order_entry_price_advanced_sell').val())
        total = amount * price;
    }

    id_notifi += 1
    var strVar = "";
    strVar += "<tr class=\"order-manager-new\" id=\"" + id_notifi + "\">";
    strVar += "                                        <td class=\"order-manager-order-date\">" + formatDate(Date.now()) + "<\/td>";
    strVar += "                                        <td class=\"order-manager-description\">Selling ฿ " + amount + "<\/td>";
    strVar += "                                        <td class=\"order-manager-status\">Waiting Buyer<\/td>";
    strVar += "                                        <td class=\"order-manager-avg-price\">$ " + price + "<\/td>";
    strVar += "                                        <td class=\"order-manager-volume\">$ " + (total).toFixed(2) + "<\/td>";
    strVar += "                                        <td class=\"order-manager-actions\">";
    strVar += "                                            <button class=\"btn btn-sm btn-danger\" data-action=\"cancel\" onclick='cancel_transaction(this)'";
    strVar += "                                                data-order-id=\"" + id_notifi + "\">cancel<\/button>";
    strVar += "                                        <\/td>";
    strVar += "                                    <\/tr>";

    $("#all-order >tbody").prepend(strVar);
    $("#buy-btc").modal('toggle')

    notify_small_order(id_notifi);
    var data = {
        "order-id": id_notifi,
        'amount': amount,
        'price': total,
        'type': 'sell',
        "time": Date.now()
    }
    allNewOrderSell.push(data);
    localStorage.allNewOrderSell = JSON.stringify(allNewOrderSell);
    //send request
    //fake
    var fee = 0.0001
    var type = "Normal"
    var side = "Seller"
    var symbol = "BTC"
    call_api_sell_coin(amount, price, total, symbol, side, type, fee, false,1);
}

function cancel_transaction(e) {
    setTimeout(function () {
        $(e).fadeOut(300, function () {
            $(this).parent().parent().remove()
            var strNotifi = "";

            strNotifi += " <div class=\"alert alert-info\" id='cancel" + id_notifi + "'>";
            strNotifi += "        <button class=\"close pull-right\" onclick='$(this).parent().remove();'>×<\/button>";
            strNotifi += "        <span>";
            strNotifi += "            <strong>Order " + $(e).data('order-id') + " <\/strong> cancelled<\/span>";
            strNotifi += "    <\/div>";

            $("#id_notifications").prepend(strNotifi)
            setTimeout(function () {
                $('#cancel' + id_notifi).remove();
            }, 3000)
        });
    }, 1000)
    //call request
    call_api_cancel_order(order_id,side);
}
function formatDate(date_nofomat) {
    var date = new Date(date_nofomat);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + "," + strTime;
}

function total_price_change_advance_buy() {
    try {
        var amount = parseFloat($('#order_entry_amount').val())
        var price = parseFloat($('#order_entry_price').val())
        if (isNaN(amount) || isNaN(price)) return
        $('#order_entry_total_advanced').val((amount * price).toFixed(2))
    } catch (err) {
        console.log(err)
    }
}
function total_price_change_advance_sell() {
    try {
        var amount = parseFloat($('#order_entry_amount_sell').val())
        var price = parseFloat($('#order_entry_price_advanced_sell').val())
        if (isNaN(amount) || isNaN(price)) return
        $('#order_entry_total_advanced_sell').val((amount * price).toFixed(2))
    } catch (err) {
        console.log(err)
    }
}

function check_validate_buy_coin(amount, price, total) {
    if (amount <= 0 || isNaN(amount)) {
        return "Amount must greater than 0"
    }
    if (price <= 0 || isNaN(price)) {
        return "Price must greater than 0"
    }
    if (total <= 0 || isNaN(total)) {
        return "Amount and price must greater than 0"
    }
    return true
}

function check_validate_sell_coin(amount, price, total) {
    if (amount <= 0 || isNaN(amount)) {
        return "Amount must greater than 0"
    }
    if (price <= 0 || isNaN(price)) {
        return "Price must greater than 0"
    }
    if (total <= 0 || isNaN(total)) {
        return "Amount and price must greater than 0"
    }
    return true
}
function call_api_buy_coin(amount, price, total, symbol, side, type, fee, is_from_market_maker,target_order) {
    var data = {
        order_qty: amount,
        status: status,
        symbol: symbol,
        side: side,
        type: type,
        price: price,
        fee: fee,
        is_from_market_maker: is_from_market_maker,
        target_order
    }
    $.ajax({
        url: '/api/trade/buy-sell/buy-coin',
        type: 'post',
        data: data,
        dataType: 'json',
        success: function (json) {
            console.log(json)
        }
    });
}

function call_api_sell_coin(amount, price, total, symbol, side, type, fee, is_from_market_maker,target_order) {
    var data = {
        order_qty: amount,
        status: status,
        symbol: symbol,
        side: side,
        type: type,
        price: price,
        fee: fee,
        is_from_market_maker: is_from_market_maker,
        target_order
    }
    $.ajax({
        url: '/api/trade/buy-sell/sell-coin',
        type: 'post',
        data: data,
        dataType: 'json',
        success: function (json) {
            console.log(json)
        }
    });
}

function call_api_cancel_order(order_id,type_order,target_order) {
    var data = {
        order_id:order_id,
        type_order:type_order,
        target_order
    }
    $.ajax({
        url: '/api/trade/buy-sell/cancel-order',
        type: 'post',
        data: data,
        dataType: 'json',
        success: function (json) {
            console.log(json)
        }
    });
}
function notify_small_order(id_notifi) {
    var strNotifi = "";

    strNotifi += "<div class=\"alert alert-info\" id='noti" + id_notifi + "'>";
    strNotifi += "        <button class=\"close pull-right\" onclick='$(this).parent().remove();'>×<\/button>";
    strNotifi += "        <span>";
    strNotifi += "            <strong>Order " + id_notifi + " <\/strong> ordered success<\/span>";
    strNotifi += "<\/div>";

    $("#id_notifications").prepend(strNotifi)
    setTimeout(function () {
        $('#noti' + id_notifi).remove();
    }, 3000)
}
function notify_small_fail(id_notifi, content) {
    var strNotifi = "";

    strNotifi += " <div class=\"alert alert-info\" id='noti" + id_notifi + "'>";
    strNotifi += "        <button class=\"close pull-right\" onclick='$(this).parent().remove();'>×<\/button>";
    strNotifi += "        <span>";
    strNotifi += "            <strong>Order " + id_notifi + " <\/strong> ordered fail, " + content + "<\/span>";
    strNotifi += "    <\/div>";

    $("#id_notifications").prepend(strNotifi)
    setTimeout(function () {
        $('#noti' + id_notifi).remove();
    }, 3000)
}
