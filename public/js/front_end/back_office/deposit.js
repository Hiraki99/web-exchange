var data = {
    "kind": "depo"
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

            if (json.status == 1) {
                var strVar = "";
                for(var i =0 ; i< json.transaction.length;i++){
                    var item = json.transaction[i];
                    strVar += "<tr class=\"deposit-list-unconfirmed\" id=\":2b.0d2f4e4de3304b0a823830a49b6ef6bd\">";
                    strVar += "                                        <td class=\"deposit-list-created\" >" + formatDate(item["createAt"]) + "<\/td>";
                    strVar += "                                        <td class=\"deposit-list-status\" >";
                    strVar += "                                            <h5>";
                    strVar += "                                                <span style=\"text-transform: uppercase\" class=\"label label-default\">" + StatusTransaction(parseInt(item["status"])) + "<\/span>";
                    strVar += "                                            <\/h5>";
                    strVar += "                                        <\/td>";
                    strVar += "                                        <td class=\"deposit-list-value\" >";
                    strVar += "                                            <abbr title=\"Dollar\">"+item["currency"]+" " + item["value"] + "<\/abbr>";
                    strVar += "                                        <\/td>";
                    strVar += "                                        <td class=\"deposit-list-method\" >" + item["id"] + "<\/td>";
                    strVar += "                                        <td class=\"deposit-list-details\" >";
                    strVar += "                                                <span style=\"text-transform: uppercase\" class=\"label label-default\">" + item["deposit_method"] + "<\/span>";

                    strVar += "                                        <\/td>";
                    strVar += "                                        <td class=\"deposit-list-actions\" >";
                    strVar += "                                            <p>" + item["currency"] + "<\/p>"

                    strVar += "                                        <\/td>";
                    strVar += "                                    <\/tr>";
                }
                $("#table_deposit >tbody").prepend(strVar);
            }



        }
    });
})

function openDeposit(currency){

    $('fieldset').css('display', 'none');

    switch(currency){
        case "BTC":
            checked = $("#balance_btc").data("account_no");
            $("#title_wallet").text("Wallet BTC")
            $("#account_btc").css('display', 'block');
            break;
        case "ETH":
            checked = $("#balance_eth").data("account_no")
            $("#title_wallet").text("Wallet ETH")
            $("#account_eth").css('display', 'block');

            break;
        case "VND":
            checked = $("#balance_vnd").data("account_no")
            $("#title_wallet").text("Wallet VND")
            $("#account_vnd").css('display', 'block');

            break;
    }
    $("#notification").modal("show");
}