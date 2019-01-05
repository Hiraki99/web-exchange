function createClickHandler(pair) {
    redictToPairTrade(pair)
};

function onMouseOverHandler(row) {
    row.className += "market-view-table-selected"
}

function onMouseOutHandler(row) {
    row.className = ""
}

function redictToPairTrade(pair) {
    localStorage.setItem("pair", pair)
    localStorage.setItem("preivous_path", 'en/trade/otc')
    getPage("/en/trade")
}
var table_order = $('#lastest-order-history').DataTable({
        "searching": true,
        "columnDefs": [{
            type: 'de_datetime',
            targets: 0
        }],
        "order": [
            [0, "desc"]
        ]
    });

Pace.track(function () {
    $.ajax({
        type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
        url: '/api/trade/otc/top-orders', // the url where we want to POST

        dataType: 'json', // what type of data do we expect back from the server
        // encode          : true
    }).done(function (data) {
        data = data["res"]
        // data = JSON.parse(data)
        if (data.status == 1) {
            for (var i = data.all_report.length - 1; i >= 0; i--) {
                item = data["all_report"][i];
                item["createAt"] = formatDate(item["createAt"]);
                var pair = item["Symbol"].split('/')
                item["Description"] = [item["Side"], item["OrderQty"],pair[0]].join(' ')
                item["Volume"] = parseFloat(parseFloat(item["OrderQty"]), parseFloat(item["Price"])).toFixed(2)
                table_order.row.add([
                    item["createAt"], item["Description"], item['OrdStatus'], Util.format_number_to_show(item['Price']), Util.format_number_to_show(item['Volume']), item["DisplayName"]
                ]).draw()
            }
            // data.all_report.forEach(item => {

            // });
        }

    });

});
$.get("https://api.coinmarketcap.com/v2/ticker/1027/?convert=BTC", function (data) {
    console.log(data)
    data = data["data"]
    data["pair-query"] = 'eth-btc'
    data["pair-upcase"] = 'ETH/BTC'
    data["AllocCurrency"] = 'BTC'
    var html = Util.item_market(data)
    $("#list-pair-coin >tbody").append(html)
});
$.get("https://api.coinmarketcap.com/v2/ticker/1/?convert=USDT", function (data) {
    data = data["data"]
    data["pair-query"] = 'btc-usdt'
    data["pair-upcase"] = 'BTC/USDT'
    data["AllocCurrency"] = 'USDT'
    var html = Util.item_market(data)
    $("#list-pair-coin >tbody").append(html)
});
$.get("https://api.coinmarketcap.com/v2/ticker/1/?convert=VND", function (data) {
    data = data["data"]
    data["pair-query"] = 'btc-vnd'
    data["pair-upcase"] = 'BTC/VND'
    data["AllocCurrency"] = 'VND'
    var html = Util.item_market(data)
    $("#list-pair-coin >tbody").append(html)
});
$.get("https://api.coinmarketcap.com/v2/ticker/1027/?convert=USDT", function (data) {
    data = data["data"]
    data["pair-query"] = 'eth-usdt'
    data["pair-upcase"] = 'ETH/USDT'
    data["AllocCurrency"] = 'USDT'
    var html = Util.item_market(data)
    $("#list-pair-coin >tbody").append(html)
});