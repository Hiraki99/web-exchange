function checkingAccNumber() {

}

function loadtransaction() {
    Pace.track(function () {
        $.ajax({
            headers: {
                "x-access-token": localStorage.getItem("token")
            },
            url: '/account/transaction',
            type: 'post',
            dataType: 'json',
            success: function (json) {
                console.log(json)

                var table_order = $('#all-transaction').DataTable({
                    "searching": true,
                    "columnDefs": [{
                        type: 'de_datetime',
                        targets: 0
                    }],
                    "order": [
                        [0, "desc"]
                    ]
                });;

                if (json.status == 1) {

                    // $("#all-transaction > thead").css("display","contents");

                    // $("#all-transaction > tbody").css("display","contents");
                    // $("#no_transaction").css("display","none");

                    json.transaction.forEach(item => {
                        item["createAt"] = formatDate(item["createAt"]);
                        console.log(item["createAt"])
                        table_order.row.add([
                            item['createAt'], item["account_no"], item["deposit_method"], item["value"], item["currency"]
                        ]).draw()
                    });

                    json.transaction_trading.forEach(item => {
                        item["TransactTime"] = formatDate(item["TransactTime"]);
                        var pair = item["Symbol"].split('/')
                        item["Description"] = [item["Side"],Util.format_number_to_show(item["OrderQty"]),pair[0] ].join(' ')
                        item["Volume"] = Util.format_number_to_show(parseFloat( parseFloat(item["OrderQty"])* parseFloat(item["Price"]) ).toFixed(5))
                        table_order.row.add([
                            item['TransactTime'],item["Account"],item["Description"],Util.format_number_to_show(item["OrderQty"]),pair[0]
                        ]).draw()
                    });

                    // var template = $('#transaction_template').html();
                    // var strVar = Mustache.render(template, json);

                    // $("#all-transaction > tbody").append(strVar);

                } else {
                    // $("#no_transaction").css("display","contents");
                }
            }
        });
    })
}

function copyClipboard(currency) {
    var copyText = document.getElementById("address_" + currency + "_new");
    copyText.select();
    document.execCommand("copy");
}

function copyCode(currency) {
    var copyText = document.getElementById("otp_code");
    copyText.select();
    document.execCommand("copy");
}

function actions(e, currency) {
    var action = e
    $('fieldset').css('display', 'none')
    var checked = true
    checkExistedAccountCurrency("VND", function (e) {
        if (e == false) addNewAccount(currency)
    })

    checkExistedBanking(function (e) {
        checked = e
    })
    $("#title_wallet").text("Wallet " + currency)
    $("#account_" + currency.toLowerCase()).css('display', 'block');
    // if(currency == "VND"){
    //     if(checked ==false){
    //         $("#banking-account").modal()
    //         return
    //     }
    // }
    switch (action) {
        case "depo":
            $("#notification").modal("show");
            if(currency == "VND") {
                console.log("$('#balance_vnd_deposit_popup').html()= "+$('#balance_vnd_deposit_popup').html())
                $('#balance_vnd_deposit_popup').html(Util.format_number_to_show(Util.format_number_to_calculate($('#balance_vnd_deposit_popup').html())))
                getOTPCode()
            }
            break;
        case "with":
            if (currency == "VND") {
                var check_kyc = true
                checkExistAndFailKyc(function(data){
                    check_kyc= data
                })
                console.log(check_kyc)
                if(!check_kyc) {
                    redirect('kyc')
                    return
                }
            }
            openWithdraw(currency);
            break;
        case "trade":
            getPage('/market');
            break;
    }
}

function getNewOTPCode() {
    clearInterval(interval_code)
    Pace.track(function () {
        $.ajax({
            headers: {
                "x-access-token": localStorage.getItem("token")
            },
            url: '/account/get-new-code',
            type: 'post',
            contentType: false,
            async: false,
            dataType: 'json',
            success: function (json) {
                console.log(json)
                try{
                    $("#otp_code").val(json['key_confirm'])
                    $("#notify_key_code").html(`<strong>Notification: </strong> Code <strong>${json["key_confirm"]}</strong> is active! Old code <strong>${json['old_code']}</strong> is expired`)
                    countdown(json['time_countdown'])
                }catch(error){
                    $("#notify_key_code").html(json['message'])
                }

            }
        });
    })
}

function getOTPCode() {
    Pace.track(function () {
        $.ajax({
            headers: {
                "x-access-token": localStorage.getItem("token")
            },
            url: '/account/get-code',
            type: 'post',
            contentType: false,
            dataType: 'json',
            success: function (json) {
                console.log(json)
                try{
                    if(json['status'] == 1){
                        $("#otp_code").val(json['key_confirm'])
                        $("#notify_key_code").html(`<strong>Notification: </strong> Code <strong>${json["key_confirm"]}</strong> is active!`)
                        countdown(json['time_countdown'])
                    }else{
                        $("#notify_key_code").html(json['message'])
                    }
                }catch(error){
                    console.log(error)
                }
            }
        });
    })
}

// create new Account if user haven't account with currency
function addNewAccount(currency) {
    console.log(currency)
    var data = {
        "currency": currency
    }
    $('fieldset').css('display', 'none')
    Pace.track(function () {
        $.ajax({
            headers: {
                "x-access-token": localStorage.getItem("token")
            },
            url: '/account/open',
            type: 'post',
            data: data,
            dataType: 'json',
            success: function (json) {
                $('fieldset').css('display', 'none')
                if (json.status == 1) {
                    updateHtmlCurrency(currency, json)
                    // $("#notification").modal("show")
                }
            }
        });
    })


}

function checkExistAndFailKyc(callback) {
    Pace.track(function () {
        $.ajax({
            headers: {
                "x-access-token": localStorage.getItem("token")
            },
            url: '/account/check-kyc',
            type: 'post',
            contentType: false,
            dataType: 'json',
            async: false,
            success: function (json) {
                if (parseInt(json.status) != 1)
                    callback(false)
                else callback(true)
            }
        });
    })
}

function checkExistedBanking(callback) {
    Pace.track(function () {
        var data = {
            "currency": "VND"
        }
        $.ajax({
            headers: {
                "x-access-token": localStorage.getItem("token")
            },
            url: '/account/check-existed-banking',
            type: 'post',
            data: data,
            dataType: 'json',
            async: false,
            success: function (json) {
                if (json.status == 1)
                    callback(false)
                else callback(true)
            }
        });
    })
}

function checkExistedAccountCurrency(currency, callback) {
    Pace.track(function () {
        var data = {
            "currency": currency
        }
        $.ajax({
            headers: {
                "x-access-token": localStorage.getItem("token")
            },
            url: '/account/check-existed-account-currency',
            type: 'post',
            data: data,
            dataType: 'json',
            async: false,
            success: function (json) {
                if (json.status != 1)
                    callback(true)
                else callback(false)
            }
        });
    })
}
// update HTML for currency
function updateHtmlCurrency(currency, json) {
    var template;
    if (currency != "VND") {
        template = $('#wallet_child_crypto').html();
    } else template = $('#wallet_account_vnd').html();
    normal = currency.toLowerCase()
    $("#balance_" + normal).data("account_no", json["account"]["account_no"])
    $("#balance_" + normal).data("account_id", json["account"]["id"])
    $("#account_" + normal).css('display', 'block');
    var strVar = Mustache.render(template, json['account']);
    $("#account_" + normal + " > .withdraw-methods").append(strVar)
}
// open popup withdraw with currency
function openWithdraw(currency) {
    if (currency != "VND") {
        $("#crypto_withdraw > .modal-dialog >.modal-content > .modal-footer > .btn-primary").remove()
        var strVar = `<button name="ok" class="btn btn-primary" onclick="currency_withdraw_transaction('${currency}')">OK</button>`
        $("#crypto_withdraw > .modal-dialog >.modal-content > .modal-footer").prepend(strVar)
        $("#title_withdraw_currency").html(Util.acronym(currency) + " withdraw");
        $("#note_deposit_currency").html("Minimum: 0.01 " + currency + " per transaction.")
        $("#crypto_withdraw").modal();
        $("#button_crypto_withdraw").attr("onclick", "currency_withdraw_transaction('" + currency + "')")
    } else {
        checkExistedBanking(function (existed) {
            if (existed) $("#dollar_withdrawal").modal();
            else $("#banking-account").modal()
        })
    }
}

function NewBanking() {
    var data = {
        "account_no": $("#balance_vnd").data("account_no"),
        "bank_name": $("#list-banking").val(),
        "bank_address": "",
        "number_bank_card": $("#bank_account_number").val(),
        "fullname_bank_card": $("#bank_account_name").val()
    }
    console.log(data)
    Pace.track(function () {
        $.ajax({
            headers: {
                "x-access-token": localStorage.getItem("token")
            },
            url: '/account/add-new-banking-account',
            type: 'post',
            data: data,
            dataType: 'json',
            success: function (json) {
                if (json.status == 1) {
                    $("#banking-account").modal('hide')
                    $("#account_dollar_withdraw").val($("#bank_account_number").val());
                    $("#name_banking_withdraw").val($("#bank_account_name").val())
                    $("#dollar_withdrawal").modal('show');
                } else {
                    $("#error_banking_account").text(json.message_error)
                }

            }
        });
    })
}
function countdown(time){
    $('#countdown-1').timeTo({seconds: parseInt(time),displayHours: false}, function(){
        $('#countdown-1').timeTo('reset')
        getNewOTPCode()
    });
}
$("input").focus(function(){
    $(".error-value-withdraw").html("")

})

function currency_withdraw_transaction(currency) {

    if (!Util.validateValueTransaction(currency, "with")) {
        $("#error-value-withdraw").html("Invalid amount " + currency + " transaction");
        return false;
    }

    var data = {
        "to": (currency == "VND") ? $("#account_dollar_withdraw").val() : $("#address_crypto_withdraw").val(),
        "value": (currency == "VND") ? (parseFloat($("#amount_dollar_withdraw").val()) * -1).toFixed(5) : (parseFloat($("#amount_crypto_withdraw").val()) * -1).toFixed(5),
        "kind": "with",
        "currency": currency,
        "deposit_method": ("Withdraw " + Util.acronym(currency)),
        "description": (currency == "VND") ? $("#dollar_Memo").val() : ""
    }
    if (data["to"] == "" || isNaN(data["value"])) {
        $(".error-value-withdraw").html("Invalid Field Transaction")
        return false
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

                var item = json["transaction"]


                var strNotifi = "";
                var notifi = {}
                if (json.status == 1) {

                    json["transaction"].forEach(it => {
                        it["createAt"] = formatDate(it["createAt"]);
                    })

                    $("#none_transaction_withdraw").css("display", "none")
                    $("#all-transaction >thead").css("display", "contents")

                    var template = $('#transaction_template').html();
                    var strVar = Mustache.render(template, json);


                    $("#all-transaction > tbody").prepend(strVar);
                    notifi["id"] = item["id"]
                    notifi["message"] = "Withdraw " + item["id"] + " <\/strong> by dollar success"
                } else {
                    notifi["id"] = "notifi_error_" + Math.floor(Math.random() * 1000000)
                    notifi["message"] = "Withdraw <\/strong> by dollar error"
                }
                var templateNoti = $('#withdraw_warning').html();
                $("#id_notifications").prepend(strNotifi)
                $("#id_notifications").fadeOut(1800000);
                $("#crypto_withdraw").modal('hide');
                $("#dollar_withdrawal").modal('hide')
            }
        });
    })
}