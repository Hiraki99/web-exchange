function currency_withdraw_transaction(currency) {

    if(! validateValueTransaction(currency,"with")){
        $("#notifi-error-dollar-with").html("Invalid amount "+currency+" transfer");
        return false;
    }
    var data = {
        "value": (parseFloat($("#amount_bicoin_withdraw").val())*-1).toFixed(12),
        "deposit_method": "Withdraw Dollar",
        "kind": "with"
    }

    if (currency == "BTC") {
        data["account_id"] = $("#balance_btc").data("account_id");
        data["account_no"] = $("#balance_btc").data("account_no");
        data["currency"] = "BTC"
        data["deposit_method"] = "Withdraw Bitcoin";
    } else {
        data["account_id"] = $("#balance_eth").data("account_id");
        data["account_no"] = $("#balance_eth").data("account_no");
        data["deposit_method"] = "Withdraw ETH";
        data["currency"] = "BTC"
    }


    console.log(data);
    Pace.track(function () {
        $.ajax({
            headers: {
                "x-access-token": localStorage.getItem("token")
            },
            url: '/account/deposit',
            type: 'post',
            data: data,
            dataType: 'json',
            success: function (json) {
                console.log(json)
                var item = json["transaction"]
                console.log(StatusTransaction(["transaction"]["status"]))

                var strNotifi = "";
                if (json.status == 1) {
                    if (path_url == "/my-withdrawls") {
                        $("#none_transaction_withdraw").css("display", "none")
                        $("#table_withdraw >head").css("display", "block")

                        var strVar = "";
                        strVar += "<tr>";
                        strVar += "                                        <td >" + formatDate(item["createAt"]) + "<\/td>";
                        strVar += "                                        <td >" + item["account_no"] + "<\/td>";
                        strVar += "                                        <td>";
                        strVar += "                                            <h5>";
                        strVar += StatusWithdraw(item["status"])
                        strVar += "                                            <\/h5>";
                        strVar += "                                        <\/td>";
                        strVar += "                                        <td class=\"withdraw-list-amount\">";
                        strVar += "                                            <abbr title=\"Dollar\">" + item["currency"] + " " + (parseFloat(item["value"]) * -1).toFixed(5) + "<\/abbr>";
                        strVar += "                                        <\/td>";
                        strVar += "                                        <td class=\"withdraw-list-details\">";
                        strVar += "                                            <table class=\"detail_transaction\">";
                        strVar += "                                                <tr>";
                        strVar += "                                                    <td style='width:25%'>Method<\/td>";
                        strVar += "                                                    <td>" + item["deposit_method"] + "<\/td>";
                        strVar += "                                                <\/tr>";

                        strVar += "                                                <tr>";
                        strVar += "                                                    <td style='width:25%'>Destination<\/td>";
                        strVar += "                                                    <td>" + item["account_no"] + "<\/td>";
                        strVar += "                                                <\/tr>";

                        strVar += "                                                <tr>";
                        strVar += "                                                    <td style='width:25%'>Currency<\/td>";
                        strVar += "                                                    <td>" + item["currency"] + "<\/td>";
                        strVar += "                                                <\/tr>";

                        strVar += "                                                <tr>";
                        strVar += "                                                    <td style='width:25%'>Description<\/td>";
                        strVar += "                                                    <td style='width:25%'>" + item["description"];

                        strVar += "                                                    <\/td>";
                        strVar += "                                                <\/tr>";

                        strVar += "                                                <tr>";
                        strVar += "                                                    <td>Actions<\/td>";
                        strVar += "                                                    <td>";
                        strVar += "                                                        <button class=\"btn btn-xs btn-default btn-withdraw-redo\" data-row=\"{&quot;WithdrawID&quot;:1464,&quot;Method&quot;:&quot;TestMethod&quot;,&quot;Currency&quot;:&quot;USD&quot;,&quot;Amount&quot;:80000000000,&quot;Data&quot;:{&quot;Instant&quot;:&quot;NO&quot;,&quot;Nome&quot;:&quot;kp&quot;,&quot;Memo&quot;:&quot;&quot;,&quot;Comments&quot;:[&quot;&quot;,&quot;dsadsa&quot;],&quot;Currency&quot;:&quot;USD&quot;,&quot;Fees&quot;:&quot;$ 8.00&quot;},&quot;Created&quot;:&quot;2018-05-15 14:11:43&quot;,&quot;Status&quot;:&quot;2&quot;,&quot;ReasonID&quot;:null,&quot;Reason&quot;:null,&quot;PercentFee&quot;:1,&quot;FixedFee&quot;:0,&quot;PaidAmount&quot;:80800000000,&quot;UserID&quot;:90000002,&quot;Username&quot;:&quot;user&quot;,&quot;BrokerID&quot;:5,&quot;ClOrdID&quot;:null,&quot;LastUpdate&quot;:&quot;2018-05-18 01:55:23&quot;}\">Cancel";
                        strVar += "                                                            <i class=\"glyphicon glyphicon-refresh\"><\/i>";
                        strVar += "                                                        <\/button>";
                        strVar += "                                                    <\/td>";

                        strVar += "                                                <\/tr>";
                        strVar += "                                            <\/table>";
                        strVar += "                                        <\/td>";
                        strVar += "                                    <\/tr>";
                        $("#table_withdraw >tbody").prepend(strVar);

                        strNotifi += " <div class=\"alert alert-success\" id='" + item["id"] + "'>";
                        strNotifi += "        <button class=\"close pull-right\" onclick='$(this).parent().remove();'>×<\/button>";
                        strNotifi += "        <span>";
                        strNotifi += "            <strong>Withdraw " + item["id"] + " <\/strong> by dollar success<\/span>";
                        strNotifi += "    <\/div>";

                    }
                } else {
                    strNotifi += " <div class=\"alert alert-success\"'>";
                    strNotifi += "        <button class=\"close pull-right\" onclick='$(this).parent().remove();'>×<\/button>";
                    strNotifi += "        <span>";
                    strNotifi += "            <strong>Withdraw <\/strong> by dollar error<\/span>";
                    strNotifi += "    <\/div>";


                }
                $("#id_notifications").prepend(strNotifi)
                $("#id_notifications").fadeOut(5000);
                $("#bitcoin_withdrawal").modal('toggle');
            }
        });
    })
}

function open_withdraw(currency) {

    if (currency == "BTC") {
        $("#button_withdraw_btc").css("display", "initial");
        $("#button_withdraw_eth").css("display", "none");
        $("#note_withdraw_currency").text("Maximum: 10 BTC. Minimum:  0.01 BTC per transaction. ")
        $("#title_withdraw_currency").text("Bitcoin withdrawal")

        $("#title_notifi_noaccount").html('Bitcoin Withdraw');
        $("#content_notifi_noaccount").html("We will generate a unique Bitcoin address that will be valid only for this transaction.")

        $('.btn-condition').css("display",'none')
        $("#button_newaddress_btc").css("display",'initial')

        if ($("#balance_btc").data("account_no") != ""){
            $("#bitcoin_withdrawal").modal("show");
        }else {
            $("#notifi_bitcoin_crypto").modal("show")
        }

    } else {
        $("#button_withdraw_btc").css("display", "none");
        $("#button_withdraw_eth").css("display", "initial");
        $("#note_withdraw_currency").text("Maximum: 250 ETH. Minimum:  0.1 ETH per transaction. ")
        $("#title_withdraw_currency").text("Etherum withdrawal")

        $("#title_notifi_noaccount").html('Etherum Withdraw');
        $("#content_notifi_noaccount").html("We will generate a unique Etherum address that will be valid only for this transaction.")

        $('.btn-condition').css("display",'none')
        $("#button_newaddress_btc").css("display",'initial')

        if ($("#balance_eth").data("account_no") != ""){
            $("#bitcoin_withdrawal").modal("show");
        }else {
            $("#notifi_bitcoin_crypto").modal("show")
        }
    }
}



var data = {
    "kind": "with"
}
Pace.track(function () {
    $.ajax({
        headers: {
            "x-access-token": localStorage.getItem("token")
        },
        url: '/account/history/deposit',
        type: 'post',
        data: data,
        dataType: 'json',
        success: function (json) {
            console.log(json)
            if (json.status == 1 && json.transaction.length > 0) {

                $("#none_transaction_withdraw").css("display", "none")
                $("#table_withdraw > thead").css("display", "contents")

                var strVar = "";
                for (var i = 0; i < json.transaction.length; i++) {
                    var item = json.transaction[i];
                    strVar += "<tr>";
                    strVar += "                                        <td >" + formatDate(item["createAt"]) + "<\/td>";
                    strVar += "                                        <td >" + item["account_no"] + "<\/td>";
                    strVar += "                                        <td>";
                    strVar += "                                            <h5>";
                    strVar += StatusWithdraw(item["status"])
                    strVar += "                                            <\/h5>";
                    strVar += "                                        <\/td>";
                    strVar += "                                        <td class=\"withdraw-list-amount\">";
                    strVar += "                                            <abbr title=\"Dollar\">" + item["currency"] + " " + (parseFloat(item["value"]) * (-1)).toFixed(5) + "<\/abbr>";
                    strVar += "                                        <\/td>";
                    strVar += "                                        <td class=\"withdraw-list-details\">";
                    strVar += "                                            <table class=\"detail_transaction\">";
                    strVar += "                                                <tr>";
                    strVar += "                                                    <td style='width:25%'>Method<\/td>";
                    strVar += "                                                    <td>" + item["deposit_method"] + "<\/td>";
                    strVar += "                                                <\/tr>";

                    strVar += "                                                <tr>";
                    strVar += "                                                    <td style='width:25%'>Destination<\/td>";
                    strVar += "                                                    <td>" + item["account_no"] + "<\/td>";
                    strVar += "                                                <\/tr>";

                    strVar += "                                                <tr>";
                    strVar += "                                                    <td style='width:25%'>Currency<\/td>";
                    strVar += "                                                    <td>" + item["currency"] + "<\/td>";
                    strVar += "                                                <\/tr>";

                    strVar += "                                                <tr>";
                    strVar += "                                                    <td style='width:25%'>Description<\/td>";
                    strVar += "                                                    <td>" + item["description"];

                    strVar += "                                                    <\/td>";
                    strVar += "                                                <\/tr>";

                    strVar += "                                                <tr>";
                    strVar += "                                                    <td>Actions<\/td>";
                    strVar += "                                                    <td>";
                    strVar += "                                                        <button class=\"btn btn-xs btn-default btn-withdraw-redo\" data-row=\"{&quot;WithdrawID&quot;:1464,&quot;Method&quot;:&quot;TestMethod&quot;,&quot;Currency&quot;:&quot;USD&quot;,&quot;Amount&quot;:80000000000,&quot;Data&quot;:{&quot;Instant&quot;:&quot;NO&quot;,&quot;Nome&quot;:&quot;kp&quot;,&quot;Memo&quot;:&quot;&quot;,&quot;Comments&quot;:[&quot;&quot;,&quot;dsadsa&quot;],&quot;Currency&quot;:&quot;USD&quot;,&quot;Fees&quot;:&quot;$ 8.00&quot;},&quot;Created&quot;:&quot;2018-05-15 14:11:43&quot;,&quot;Status&quot;:&quot;2&quot;,&quot;ReasonID&quot;:null,&quot;Reason&quot;:null,&quot;PercentFee&quot;:1,&quot;FixedFee&quot;:0,&quot;PaidAmount&quot;:80800000000,&quot;UserID&quot;:90000002,&quot;Username&quot;:&quot;user&quot;,&quot;BrokerID&quot;:5,&quot;ClOrdID&quot;:null,&quot;LastUpdate&quot;:&quot;2018-05-18 01:55:23&quot;}\">Cancel";
                    strVar += "                                                            <i class=\"glyphicon glyphicon-refresh\"><\/i>";
                    strVar += "                                                        <\/button>";
                    strVar += "                                                    <\/td>";

                    strVar += "                                                <\/tr>";
                    strVar += "                                            <\/table>";
                    strVar += "                                        <\/td>";
                    strVar += "                                    <\/tr>";
                }
                $("#table_withdraw > tbody").prepend(strVar);
            }



        }
    });
})