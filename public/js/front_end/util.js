var Util = {
    list_bid: [],
    list_ask: [],
    old_list_bid: [],
    old_list_ask: [],
    list_my_order: [],
    AMOUNT_BID_ASK_SHOW: 8,
    FEE_VALUE: 0.002,
    NUMBER_ORDER_SHOW_TRADE_HISTORY: 20,
    format_number_to_show: function format_number_to_show(number) {
        var str_tmp = number + ""
        var head = ""
        var tail = ""
        var list = str_tmp.split('.')
        if (list.length == 2) {
            head = list[0]
            tail = list[1]
        } else {
            head = list[0]
        }

        var result = ""
        var j = 0;
        for (var i = head.length - 1; i >= 0; i--) {
            j += 1
            if (j % 3 == 0 && i > 0) {
                result = "," + head[i] + result
            } else {
                result = head[i] + result
            }
        }
        return list.length == 2 ? result + "." + tail : result
    },
    format_number_to_calculate: function format_number_to_calculate(number) {
        number = number + ""
        return parseFloat(number.replace(/,/g, ""))
    },
    fix_number: function fix_number(number, fix) {
        // console.log("number = " + number)
        var str = number + ""
        // console.log("str = " + str)
        var str_list = str.split(".", 2)
        if (str_list.length == 2 && str_list[1].length > fix) {
            return parseFloat(number).toFixed(fix)
        } else {
            if (str_list.length == 2) {
                return parseFloat(number)
            } else {
                return parseFloat(number)
            }
        }
    },

    sort_list_order: function sort_list_order(list = [], type = 'DESC') {
        // type: DESC | ASC
        // price -> time -> amount

        if (type == "ASC") {
            list.sort(function (order1, order2) {
                if (order1['Price'] != order2['Price']) {
                    return order1['Price'] > order2['Price'] ? 1 : -1
                } else if (new Date(order1['TransactTime']).getTime() != new Date(order2['TransactTime']).getTime()) {
                    return new Date(order1['TransactTime']).getTime() < new Date(order2['TransactTime']).getTime() ? 1 : -1
                } else if (order1['OrderQty'] != order2['OrderQty']) {
                    return order1['OrderQty'] > order2['OrderQty'] ? 1 : -1
                } else {
                    return 0
                }
            })
        } else {
            list.sort(function (order1, order2) {
                if (order1['Price'] != order2['Price']) {
                    return order1['Price'] < order2['Price'] ? 1 : -1
                } else if (new Date(order1['TransactTime']).getTime() != new Date(order2['TransactTime']).getTime()) {
                    return new Date(order1['TransactTime']).getTime() > new Date(order2['TransactTime']).getTime() ? 1 : -1
                } else if (order1['OrderQty'] != order2['OrderQty']) {
                    return order1['OrderQty'] < order2['OrderQty'] ? 1 : -1
                } else {
                    return 0
                }
            })
        }
        return list
    },
    sort_to_time: function sort_to_time(list) {
        try {
            list.sort(function (order1, order2) {

                time1 = new Date(order1['TransactTime']).getTime()

                time2 = new Date(order2['TransactTime']).getTime()

                if (time1 > time2) {
                    return -1
                } else if (time1 < time2) {
                    return 1
                } else {
                    return 0
                }
            })
        } catch (error) {
            console.log(error)
        }
    },
    merge_list_order: function (listOrder) {
        console.log("listOrder: " + listOrder)
        try {

            var count = 0;
            var tmp_list = []
            var item = {
                'Price': listOrder[0]['Price'],
                'Amount': parseFloat(listOrder[0]['OrderQty'])
            }
            for (var i = 0; i < listOrder.length - 1; i++) {
                if (listOrder[i]['Price'] == listOrder[i + 1]['Price']) {
                    item['Amount'] += parseFloat(listOrder[i + 1]['OrderQty'])
                } else {
                    tmp_list.push(item);
                    count++
                    if (count >= this.AMOUNT_BID_ASK_SHOW)
                        return tmp_list
                    item = {
                        'Price': listOrder[i + 1]['Price'],
                        'Amount': parseFloat(listOrder[i + 1]['OrderQty'])
                    }
                }
                if (i + 1 == listOrder.length - 1) {
                    tmp_list.push(item);
                }
            }
            return tmp_list

        } catch (error) {
            console.log(error)
            return []
        }
    },
    getParentUrl: function getParentUrl(url) {
        var arr = url.split("/");
        if (arr.length == 1) return url
        else {
            var res = "";
            for (var i = 1; i < arr.length - 1; i++)
                res += "/" + arr[i]
            return res
        }
    },
    checkValueWithdraw: function checkValueWithdraw(value_transfer, mininum, maximum) {
        if (value_transfer > mininum && value_transfer < maximum) return true;
        return false
    },
    checkValueMinimum: function checkValueMinimum(value_transfer, mininum) {
        if (value_transfer > mininum) return true;
        return false
    },
    validateValueTransaction: function validateValueTransaction(currency, type) {

        switch (currency) {
            case "VND":
                if (type == "depo") {
                    if (this.checkValueMinimum(parseFloat($("#amount_dollar").val()).toFixed(5), 100000))
                        return true
                } else if (this.checkValueWithdraw(parseFloat($("#amount_dollar_withdraw").val()).toFixed(5), 100000, 100000000))
                    return true
                break;
            case "BTC":
                if (type == "depo") {
                    if (this.checkValueMinimum(parseFloat($("#amount_crypto").val()).toFixed(5), 0.01))
                        return true;
                } else if (this.checkValueWithdraw(parseFloat($("#amount_crypto_withdraw").val()).toFixed(5), 0.01, 10))
                    return true;
                break;
            case "ETH":
                if (type == "depo") {
                    if (this.checkValueMinimum(parseFloat($("#amount_crypto").val()).toFixed(5), 0.01))
                        return true
                } else if (this.checkValueWithdraw(parseFloat($("#amount_crypto_withdraw").val()).toFixed(5), 0.01, 25))
                    return true
                break;
            case "USDT":
                if (type == "depo") {
                    if (this.checkValueMinimum(parseFloat($("#amount_crypto").val()).toFixed(5), 0.01))
                        return true
                } else if (this.checkValueWithdraw(parseFloat($("#amount_crypto_withdraw").val()).toFixed(5), 0.01, 50000))
                    return true
                break;
        }
        return false;
    },
    StatusTransaction: function StatusTransaction(e) {
        switch (e) {
            case 0:
                return "Pending";
            case 1:
                return "Unconfirmed";
            case 2:
                return "In-progress";
            case 4:
                return "Complete";
            case 8:
                return "Cancelled";
        }
    },
    deposit_currency_transaction: function deposit_currency_transaction(currency) {
        if (!Util.validateValueTransaction("VND", "depo")) {
            $("#notifi-error-crypto-value").html("Invalid amount " + currency + " transfer");
            return false;
        }
        var data = {
            "currency": currency,
            "value": $("#amount_crypto").val(),
            "kind": "depo"
        }

        if (currency == "BTC") {
            data["account_id"] = $("#balance_btc").data("account_id");
            data["account_no"] = $("#balance_btc").data("account_no");
            data["deposit_method"] = "Deposit Bitcoin";
        } else {
            data["account_id"] = $("#balance_eth").data("account_id");
            data["account_no"] = $("#balance_eth").data("account_no");
            data["deposit_method"] = "Deposit ETH";
        }
        console.log(data);
        Pace.track(function () {
            $.ajax({
                headers: {
                    "x-access-token": localStorage.getItem("token")
                },
                url: '/account/create-transaction',
                type: 'post',
                data: data,
                dataType: 'json',
                success: function (json) {
                    console.log(json)
                    console.log(Util.StatusTransaction(json["transaction"]["status"]))
                    var strNotifi = "";
                    if (json.status == 1) {
                        if (path_url == "/my-deposit") {
                            var strVar = "";
                            strVar += "<tr class=\"deposit-list-unconfirmed\" id=\":2b.0d2f4e4de3304b0a823830a49b6ef6bd\">";
                            strVar += "                                        <td class=\"deposit-list-created\" >" + formatDate(json["transaction"]["createAt"]) + "<\/td>";
                            strVar += "                                        <td class=\"deposit-list-status\" >";
                            strVar += "                                            <h5>";
                            strVar += "                                                <span style=\"text-transform: uppercase\" class=\"label label-default\">" + Util.StatusTransaction(json["transaction"]["status"]) + "<\/span>";
                            strVar += "                                            <\/h5>";
                            strVar += "                                        <\/td>";
                            strVar += "                                        <td class=\"deposit-list-value\" >";
                            strVar += "                                            <abbr title=\"Dollar\">฿ " + json["transaction"]["value"] + "<\/abbr>";
                            strVar += "                                        <\/td>";
                            strVar += "                                        <td class=\"deposit-list-method\" >" + json["transaction"]["id"] + "<\/td>";
                            strVar += "                                        <td class=\"deposit-list-details\" >";
                            strVar += "                                                <span style=\"text-transform: uppercase\" class=\"label label-default\">" + json["transaction"]["deposit_method"] + "<\/span>";

                            strVar += "                                        <\/td>";
                            strVar += "                                        <td class=\"deposit-list-actions\" >";
                            strVar += "                                            <p>" + json["transaction"]["currency"] + "<\/p>"

                            strVar += "                                        <\/td>";
                            strVar += "                                    <\/tr>";
                            $("#table_deposit >tbody").prepend(strVar);
                        }



                        strNotifi += " <div class=\"alert alert-success\" id='" + json["transaction"]["id"] + "'>";
                        strNotifi += "        <button class=\"close pull-right\" onclick='$(this).parent().remove();'>×<\/button>";
                        strNotifi += "        <span>";
                        strNotifi += "            <strong>Deposit " + json["transaction"]["id"] + " <\/strong> by dollar success<\/span>";
                        strNotifi += "    <\/div>";
                        if (currency == "BTC")
                            $("#balance_btc").html(parseFloat(json["balance_account"]).toFixed(5))
                        else $("#balance_eth").html(parseFloat(json["balance_account"]).toFixed(5))

                    } else {
                        strNotifi += " <div class=\"alert alert-success\">";
                        strNotifi += "        <button class=\"close pull-right\" onclick='$(this).parent().remove();'>×<\/button>";
                        strNotifi += "        <span>";
                        strNotifi += "            <strong>Deposit<\/strong> by dollar error<\/span>";
                        strNotifi += "    <\/div>";
                    }

                    $("#id_notifications").prepend(strNotifi)
                    $("#id_notifications").fadeOut(5000);

                    $("#currency_deposit").modal('toggle');
                }
            });
        })
    },
    openTransactionVND: function openTransactionVND(cmd) {
        if ($("#balance_vnd").data("account_no") != "") {
            switch (cmd) {
                case "depo":
                    $("#dollar_deposit").modal('show')
                    break;
                case "with":
                    $("#dollar_withdrawal").modal('show')
                    break;
            }
        } else {
            switch (cmd) {
                case "depo":
                    $("#title_notifi_noaccount").html('VND Deposit');
                    break;
                case "with":
                    $("#title_notifi_noaccount").html('VND Withdraw');
                    break;
            }
            $("#content_notifi_noaccount").html("Please click OK to reirect to page open account VND")
            $('.btn-condition').css("display", 'none')
            $("#button_newaddress_vnd").css("display", 'initial')
            $("#notifi_bitcoin_crypto").modal("show")
        }
    },
    deposit_cryptocurrency_fee: function deposit_cryptocurrency_fee() {
        var amount = parseFloat($("#amount_crypto").val())
        if (isNaN(amount)) return;

        $("#fee_value_bitcoin").html(amount * 0.01.toFixed(5))
        $("#net_value_bitcoin").html(amount * 1.01.toFixed(5))

    },
    deposit_cryptocurrency: function deposit_cryptocurrency(currency) {
        $('.btn-condition').css("display", 'none')
        if (currency == "BTC") {
            $("#title_currency_deposit").html("Bitcoin deposit");
            $("#button_btc").css("display", "initial");
            $("#button_eth").css("display", "none");
            $("#note_deposit_currency").html("Minimum: 0.01 BTC per transaction.")

            $("#title_notifi_noaccount").html('Bitcoin Deposit');
            $("#content_notifi_noaccount").html("We will generate a unique Bitcoin address that will be valid only for this transaction.")


            $("#button_newaddress_btc").css("display", 'initial')

            if ($("#balance_btc").data("account_no") != "") {
                $("#currency_deposit").modal("show");
            } else {
                $("#notifi_bitcoin_crypto").modal("show")
            }

        } else {
            $("#title_currency_deposit").html("Etherum deposit");
            $("#button_btc").css("display", "none");
            $("#button_eth").css("display", "initial");
            $("#note_deposit_currency").html("Minimum: 0.01 ETH per transaction.")

            $("#title_notifi_noaccount").html('Etherum Deposit');
            $("#content_notifi_noaccount").html("We will generate a unique Etherum address that will be valid only for this transaction.")

            $("#button_newaddress_eth").css("display", 'initial')

            if ($("#balance_eth").data("account_no") != "") {
                $("#currency_deposit").modal("show");
            } else {
                $("#notifi_bitcoin_crypto").modal("show")
            }
        }



    },
    notify_status_order: function (status, side, order_id, content) {
        // status: true -> order cancel
        // status: fail -> order fail
        // id_notif when status : failt => order_new
        var json = {
            "order_id": order_id,
            "status": status,
            'log': content,
            'side': side
        }
        var template = $('#template_warning').html();
        var strVar = Mustache.render(template, json);

        $("#id_notifications").prepend(strVar)
        setTimeout(function () {
            $('#noti' + order_id).remove();
        }, 5000)
    },
    notify_order_invalid: function (message) {
        var ran = parseInt(Math.random() * 1000000000)
        var json = {
            "order_id": ran,
            'message': message,
        }
        var template = $('#template_warning_invalid').html();
        var strVar = Mustache.render(template, json);

        $("#id_notifications").prepend(strVar)
        setTimeout(function () {
            $('#noti' + ran + "invalid").remove();
        }, 5000)
    },
    check_validate_sell_coin: function check_validate_sell_coin(amount, price, total) {
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
    },
    check_validate_buy_coin: function check_validate_buy_coin(amount, price, total) {
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
    },
    priceBuy: function priceBuy() {
        try {
            var fix_amount = 5
            var fix_price = 5
            var fix_total = 5
            var price = parseFloat($('#order_entry_price_bid').val())
            var total = parseFloat($('#order_entry_total_bid').val())
            var amount = parseFloat($('#order_entry_amount_bid').val())
            if (total < 0) {
                total = 0;
                $('#order_entry_total_bid').val(0)
            }
            if (price < 0) {
                price = 0;
                $('#order_entry_price_bid').val(0)
            }
            if (amount < 0) {
                amount = 0;
                $('#order_entry_amount_bid').val(0)
            }
            price = this.fix_number($('#order_entry_price_bid').val(), fix_price)

            if (($('#order_entry_amount_bid').val())) {
                $('#order_entry_total_bid').val(this.fix_number((price * amount).toFixed(fix_total), fix_total))
            } else {
                if (!($('#order_entry_amount_bid').val()) && ($('#order_entry_total_bid').val())) {
                    $('#order_entry_amount_bid').val(this.fix_number(total * price, fix_amount))
                }
            }
            this.fee_buy()

        } catch (error) {
            console.log(error);
        }
    },
    totalBuy: function totalBuy() {
        try {
            var fix_amount = 5
            var fix_price = 5
            var fix_total = 5
            var price = parseFloat($('#order_entry_price_bid').val())
            var total = parseFloat($('#order_entry_total_bid').val())
            var amount = parseFloat($('#order_entry_amount_bid').val())
            if (total < 0) {
                total = 0;
                $('#order_entry_total_bid').val(0)
            }
            if (price < 0) {
                price = 0;
                $('#order_entry_price_bid').val(0)
            }
            if (amount < 0) {
                amount = 0;
                $('#order_entry_amount_bid').val(0)
            }
            total = this.fix_number($('#order_entry_total_bid').val(), fix_total)


            if (($('#order_entry_price_bid').val())) {
                $('#order_entry_amount_bid').val(this.fix_number(total / price, fix_amount))
            } else {
                if (($('#order_entry_amount_bid').val()) && !($('#order_entry_price_bid').val())) {
                    $('#order_entry_price_bid').val(this.fix_number(total / amount, fix_price))
                }
            }
            this.fee_buy()

        } catch (error) {
            console.log(error);
        }
    },
    amountSell: function amountSell() {
        try {
            var fix_amount = 5
            var fix_price = 5
            var fix_total = 5
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
            amount = this.fix_number($('#order_entry_amount_sell').val(), fix_amount)

            if (($('#order_entry_price_sell').val())) {
                $('#order_entry_total_sell').val(this.fix_number((price * amount).toFixed(fix_total), fix_total))
            } else {
                if (($('#order_entry_total_sell').val()) && !($('#order_entry_price_sell').val())) {
                    $('#order_entry_price_sell').val(this.fix_number(total / amount, fix_price))
                }
            }
            this.fee_sell()

        } catch (error) {
            console.log(error);
        }
    },
    priceSell: function priceSell() {
        try {
            var fix_amount = 5
            var fix_price = 5
            var fix_total = 5
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
            price = this.fix_number($('#order_entry_price_sell').val(), fix_price)

            if (($('#order_entry_amount_sell').val())) {
                $('#order_entry_total_sell').val(this.fix_number((price * amount).toFixed(fix_total), fix_total))
            } else {
                if (!($('#order_entry_amount_sell').val()) && ($('#order_entry_total_sell').val())) {
                    $('#order_entry_amount_sell').val(this.fix_number(total / price, fix_amount))
                }
            }
            this.fee_sell()

        } catch (error) {
            console.log(error);
        }
    },
    totalSell: function totalSell() {
        try {

            var fix_amount = 5
            var fix_price = 5
            var fix_total = 5
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
                $('#order_entry_amount_bid').val(0)
            }
            total = this.fix_number($('#order_entry_total_sell').val(), fix_total)
            // price = this.fix_number(price, fix_price)
            // $('#order_entry_price_sell').val(price)
            // amount = this.fix_number(amount, fix_amount)
            // $('#order_entry_amount_bid').val(amount)

            if (($('#order_entry_price_sell').val())) {
                $('#order_entry_amount_sell').val(this.fix_number(total / price, fix_amount))
            } else {
                if (($('#order_entry_amount_sell').val()) && !($('#order_entry_price_sell').val())) {
                    $('#order_entry_price_sell').val(this.fix_number(total / amount, fix_price))
                }
            }
            this.fee_sell()
        } catch (err) {
            console.log(err);
        }
    },

    amountBuy: function amountBuy() {
        try {
            var fix_amount = 5
            var fix_price = 5
            var fix_total = 5
            var price = parseFloat($('#order_entry_price_bid').val())
            var total = parseFloat($('#order_entry_total_bid').val())
            var amount = parseFloat($('#order_entry_amount_bid').val())
            if (total < 0) {
                total = 0;
                $('#order_entry_total_bid').val(0)
            }
            if (price < 0) {
                price = 0;
                $('#order_entry_price_bid').val(0)
            }
            if (amount < 0) {
                amount = 0;
                $('#order_entry_amount_bid').val(0)
            }
            amount = this.fix_number($('#order_entry_amount_bid').val(), fix_amount)

            if (($('#order_entry_price_bid').val())) {
                // console.log("price = " + price)
                // console.log("amount = " + amount)
                // console.log("total = " + (price * amount).toFixed(fix_total))
                $('#order_entry_total_bid').val(this.fix_number((amount * price).toFixed(fix_total), fix_total))
            } else {
                if (($('#order_entry_total_bid').val()) && !($('#order_entry_price_bid').val())) {
                    $('#order_entry_price_bid').val(this.fix_number(total * amount, fix_price))
                }
            }
            this.fee_buy()

        } catch (error) {
            console.log(error);
        }
    },
    fee_buy: function () {
        var fix_amount = 5
        var amount = parseFloat($('#order_entry_amount_bid').val())
        var fee_buy = amount * this.FEE_VALUE
        console.log("fee_buy = " + fee_buy)
        $('#order_entry_fee_buy').html(Util.format_number_to_show(this.fix_number(fee_buy, fix_amount + 3)))
        $('#order_entry_fee_buy').val(this.fix_number(fee_buy, fix_amount + 3))

    },
    fee_sell: function () {
        var fix_total = 5
        var total = parseFloat($('#order_entry_total_sell').val())
        var fee_sell = total * this.FEE_VALUE
        console.log("fee_sell = " + fee_sell)
        $('#order_entry_fee_sell').html(Util.format_number_to_show(this.fix_number(fee_sell, fix_total + 3)))
        $('#order_entry_fee_sell').val(this.fix_number(fee_sell, fix_total + 3))
    },
    logout: function logout() {
        console.log("Logout")
        $.ajax({
            headers: {
                "x-access-token": localStorage.getItem("token")
            },
            url: '/logout',
            type: 'POST',
            data: {},
            success: function (json) {
                localStorage.setItem("token", "")
                window.location.href = '/'
            }
        });

    },
    load_balance_account: function load_balance_account(type, c2c) {
        console.log("load_balance_account avaiable")
        $.ajax({
            headers: {
                "x-access-token": localStorage.getItem("token")
            },
            url: '/api/trade/otc/avaiable-balance',
            type: 'POST',
            data: {
                'Symbol': c2c
            },
            success: function (json) {
                //update avaible balance
                // console.log(json)
                try {
                    var pair = c2c.split("-");
                    $(".avaiable_balance_buy").val(Util.format_number_to_show(json[pair[1].toUpperCase()]['avaiable'].toFixed(5)))
                    $("#locked_buy_account").html("0.00")
                    $("#locked_buy_account").data('amount', 0.00)
                    // console.log(json[pair[1].toUpperCase()]['balance'] - json[pair[1].toUpperCase()]['avaiable'])
                    $(".avaiable_balance_sell").val(Util.format_number_to_show(json[pair[0].toUpperCase()]['avaiable'].toFixed(5)))
                    // console.log(json[pair[0].toUpperCase()]['balance'] - json[pair[0].toUpperCase()]['avaiable'])
                    $("#locked_sell_account").html("0.00")
                    $("#locked_sell_account").data('amount', 0.00)


                    $(".avaiable_balance_buy").html(Util.format_number_to_show(json[pair[1].toUpperCase()]['avaiable'].toFixed(5)))
                    $(".avaiable_balance_sell").html(Util.format_number_to_show(json[pair[0].toUpperCase()]['avaiable'].toFixed(5)))
                } catch (error) {
                    console.log(error)
                }

            }
        });
    },

    //  convert acronym to full name : BTC => Bitcoin, ETH => etherum
    acronym: function acronym(currency) {
        switch (currency) {
            case "BTC":
                return "Bitcoin";
            case "ETH":
                return "Etherum";
            case "USDT":
                return "Tether";
            case "VND":
                return "Vietnamdong";
        }
    },
    item_market: function item_market(data) {
        var alloc_currency = data["AllocCurrency"]
        data["price_low"] = ((data['quotes'][alloc_currency]['price'] / (1 + data['quotes'][alloc_currency]['percent_change_24h'] / 100))).toFixed(5)

        var price_low, price_high;
        if (data['quotes'][alloc_currency]['percent_change_24h'] > 0) {
            price_low = ((data['quotes'][alloc_currency]['price'] * (1 - data['quotes'][alloc_currency]['percent_change_24h'] / 100))).toFixed(5)
            price_high = data['quotes'][alloc_currency]['price'].toFixed(5)
        } else {
            price_high = ((data['quotes'][alloc_currency]['price'] * (1 + data['quotes'][alloc_currency]['percent_change_24h'] / 100))).toFixed(5)
            price_low = data['quotes'][alloc_currency]['price'].toFixed(5)
        }

        var html = `<tr data-symbol="${data['pair-upcase']}" onclick="createClickHandler('${data['pair-query']}')" onmouseover="onMouseOverHandler(this)" onmouseout="onMouseOutHandler(this)" style="cursor: pointer;" target="_self" class="">
                <td>${data['pair-upcase']} </td>
                <td>
                    <span class="bitex-model" data-model-key="formatted_BLINK_BTCVEF_BEST_BID">${Util.format_number_to_show((alloc_currency == "VND") ? parseInt(data['quotes'][alloc_currency]['price']) : (data['quotes'][alloc_currency]['price'] < 1 ? data['quotes'][alloc_currency]['price'].toFixed(5) : data['quotes'][alloc_currency]['price'].toFixed(2)))}</span>
                </td>
                <td>
                    <span class="bitex-model" data-model-key="formatted_BLINK_BTCVEF_BEST_ASK">${data['quotes'][alloc_currency]['percent_change_24h'].toFixed(2)} %</span>
                </td>
                <td>
                    <span class="bitex-model" data-model-key="formatted_BLINK_BTCVEF_SELL_VOLUME">${Util.format_number_to_show((alloc_currency != "VND") ? (price_high < 1 ? price_high : price_high) : parseInt(price_high))}</span>
                </td>
                <td>
                    <span class="bitex-model" data-model-key="formatted_BLINK_BTCVEF_BUY_VOLUME">${Util.format_number_to_show((alloc_currency != "VND") ? (price_low < 1 ? price_low : price_low) : parseInt(price_low))}</span>
                </td>
                <td>
                    <span class="bitex-model" data-model-key="formatted_BLINK_BTCVEF_HIGH_PX">${Util.format_number_to_show((alloc_currency != "VND") ? data['quotes'][alloc_currency]['market_cap'].toFixed(2) : parseInt(data['quotes'][alloc_currency]['market_cap']))}</span>
                </td>
            </tr>`
        return html;
    },
    market_trading: function market_trading(data) {
        var alloc_currency = data["AllocCurrency"]
        if (data['quotes'][alloc_currency]['percent_change_24h'] > 0) data["increment_price"] = true
        else data["increment_price"] = false

        var html = `
            <tr data-pair="${data['pair-query']}" style="display:table;width:100%;table-layout:fixed;" onclick="select(this,'${data['pair-query']}')" onmouseover="onMouseOverHandler(this)" onmouseout="onMouseOutHandler(this)">

                <td style="font-size: 12px !important; color: rgb(153, 153, 153);" class="real-time-market-price-ask info-pair">${data['pair-upcase']} </td>
                <td style="text-align: center; font-size: 12px !important; color: rgb(153, 153, 153);" class="real-time-market-price-ask info-pair">${Util.format_number_to_show((alloc_currency == "VND") ? parseInt(data['quotes'][alloc_currency]['price']) : (data['quotes'][alloc_currency]['price'] < 1 ? data['quotes'][alloc_currency]['price'].toFixed(5) : data['quotes'][alloc_currency]['price'].toFixed(2)))}</td>
                ${(data["increment_price"] == false) ?
                `<td style="color: red;  font-size: 12px !important;text-align: right;" class="real-time-market-price-ask">(${data['quotes'][alloc_currency]['percent_change_24h'].toFixed(2)}%)</td>`
                : `<td style="color: green; font-size: 12px !important; text-align: right;" class="real-time-market-price-ask">(${data['quotes'][alloc_currency]['percent_change_24h'].toFixed(2)}%)</td>`}
                
            </tr>`

        return html
    },
    trade_history_otc: function trade_history_otc(data) {
        // console.log("trade_history_otc "+JSON.stringify(data))

        var html = `
            <tr style="display:table;width:100%;table-layout:fixed;" onmouseover="onMouseOverHandler(this)" onmouseout="onMouseOutHandler(this)">
                ${(data['side'] == "Buy") ?
                `<td style="color: red;  font-size: 12px !important;text-align: left;" class="">${Util.format_number_to_show(data['price'])}</td>`
                : `<td style="color: green; font-size: 12px !important; text-align: left;" class="">${Util.format_number_to_show(data['price'])}</td>`}
                <td style="text-align: center;font-size: 12px !important; color: rgb(153, 153, 153);" class="">${Util.format_number_to_show(data['amount'])}</td>
                <td style="text-align: right; font-size: 12px !important; color: rgb(153, 153, 153);" class="">${data['symbol']}</td>
                
            </tr>`

        return html
    },
    trade_history_realtime: function trade_history_realtime(data) {

        var html = `
            <tr style="display:table;width:100%;table-layout:fixed;" onmouseover="onMouseOverHandler(this)" onmouseout="onMouseOutHandler(this)">
                ${(data['side'] == "Buy") ?
                `<td style="color: rgb(236, 83, 83)" class="">${Util.format_number_to_show(data['price'])}</td>`
                : `<td style="color: rgb(117, 226, 74)" class="">${Util.format_number_to_show(data['price'])}</td>`}
                <td style="text-align: center" class="">${Util.format_number_to_show(data['amount'])}</td>
                <td style="text-align: right" class="k">${data['time']}</td>
                
            </tr>`

        return html
    },
    update_total_daily_transaction: function update_total_daily_transaction() {
        $('#total-daily-transaction').html(Util.format_number_to_show(Util.format_number_to_calculate($('#total-daily-transaction').html()) + 1))
    }
}