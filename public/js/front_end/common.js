var price_market = {};
var interval_code;
function changeCSS(cssFile, cssLinkIndex) {

    var oldlink = document.getElementsByTagName("link").item(cssLinkIndex);

    var newlink = document.createElement("link");
    newlink.setAttribute("rel", "stylesheet");
    newlink.setAttribute("type", "text/css");
    newlink.setAttribute("href", cssFile);

    document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
}

function sort_fill_matching() {
    $('#all-order > tbody > .order-manager-cancel').css('display', 'none');
    $('#all-order > tbody > .order-manager-new').css('display', 'none');
    $('#all-order > tbody > .order-manager-fill').removeAttr('style')

}

function sort_cancel_matching() {

    $('#all-order > tbody > .order-manager-cancel').removeAttr('style')
    $('#all-order > tbody > .order-manager-new').css('display', 'none');
    $('#all-order > tbody > .order-manager-fill').css('display', 'none')

}

function sort_open_matching() {
    $('#all-order > tbody > .order-manager-new').removeAttr('style')
    $('#all-order > tbody > .order-manager-cancel').css('display', 'none');
    $('#all-order > tbody > .order-manager-fill').css('display', 'none')

}

function sort_all_matching() {
    $('#all-order > tbody > tr').removeAttr('style')
}


// check token saved in localStorage valid
function checkValidToken() {
    var x = localStorage.getItem("token");
    console.log(x)
    if (x == "" || x == null || typeof (x) == "undefined") return false
    return true
}


// function format Datetime dd-mm-yy, h:m:s
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hours = d.getHours(),
        minutes = d.getMinutes(),
        seconds = d.getSeconds();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hours < 10) hours = '0' + hours;
    if (minutes < 10) minutes = '0' + minutes;
    if (seconds < 10) seconds = '0' + seconds;
    var getCurrentAmPm = hours >= 12 ? 'PM' : 'AM';

    return [day, month, year].join('-') + " " + [hours, minutes, seconds, getCurrentAmPm].join(':');
}

function htmlBalance(currency,json){
    try{
        console.log(currency)
        console.log(json[currency]["balance"])
        console.log(json[currency]["avaiable"])
        
        $("#balance_"+currency.toLowerCase()+"_account").text(" " + Util.format_number_to_show(json[currency]["balance"].toFixed(5)));
        // $("#balance_"+currency.toLowerCase()).data("account_no", getvaluejson(json[currency], "account_no"))
        // $("#balance_"+currency.toLowerCase()).data("account_id", getvaluejson(json[currency], "id"))
        $("#total_balance_"+currency.toLowerCase()).html(Util.format_number_to_show(json[currency]["balance"].toFixed(5)))
        $("#available_"+currency.toLowerCase()).html(Util.format_number_to_show(json[currency]["avaiable"].toFixed(5)))
        $("#value_"+currency.toLowerCase()).html(Util.format_number_to_show(json[currency]["value"].toFixed(5)))
        $("#in_order_"+currency.toLowerCase()).html(Util.format_number_to_show(json[currency]["in_order"].toFixed(5)))
    }catch(err){
        // console.log(err)
    }
}
// function loadBalance of user with all currency
function loadBalance() {
    try {
        Pace.track(function () {
            load_total_daily_transaction()
            $.ajax({
                headers: {
                    "x-access-token": localStorage.getItem("token")
                },
                url: '/account/info-wallet',
                type: 'post',
                dataType: 'json',
                success: function (json) {
                    // console.log(json)
                    if (json.status == 1) {
                        for(var key in json) {
                            htmlBalance(key,json)
                            // break;
                        }
                    }
                }
            });
        })  
    } catch (error) {
        console.log(error)
    }
}
// hide paramater in url
$("input").focus(function () {
    $(".error-value").html("");
});

function StatusWithdraw(e) {
    switch (parseInt(e)) {
        case 0:
            return " <span style=\"text-transform: uppercase\" title=\"undefined\" class=\"label label-info\">Pending<\/span>";
        case 1:
            return " <span style=\"text-transform: uppercase\" title=\"undefined\" class=\"label label-important\">Unconfirmed<\/span>";

        case 2:

            return " <span style=\"text-transform: uppercase\" title=\"undefined\" class=\"label label-info\">In-progress<\/span>";
        case 4:

            return " <span style=\"text-transform: uppercase\" title=\"undefined\" class=\"label label label-success\">Complete<\/span>";
        case 8:

            return " <span style=\"text-transform: uppercase\" title=\"undefined\" class=\"label label label-important\">Cancelled<\/span>";
    }
}

// change pair on page
function changePair(c2c){
    if (c2c == null) {
        c2c = "eth-btc"
        localStorage.setItem("pair",c2c);
    }
    addExchangeRate(c2c)
    var pair = c2c.split("-");
    $(".pair-currency").html(pair[1].toUpperCase() +' \\'+' '+pair[0].toUpperCase())
    $(".pairCoinfirst").html(pair[0].toUpperCase())
    $(".pairCoinSecond").html(pair[1].toUpperCase())
    $("#list-pair-real-time-market").val(c2c);
    //update load balance and balance avaiable
    try {
        Util.load_balance_account('all',c2c)    
    } catch (error) {
        
    }
    

}
// thay doi khi click vao select cac cap tien ao tren thanh navigator
function import_chart() {
    try {
     
        var version = Math.floor( Math.random()*100000000);
        $("#market_trading_view > iframe").remove();
        var chart = document.createElement("iframe");
        chart.src= "/labs/html/tradingview.html"+"?v=" + version;
        document.getElementById("market_trading_view").appendChild(chart)   
    } catch (error) {
        
    }
}
function handleSelect(elm) {
    localStorage.setItem("pair", $(elm).val())

    import_chart()
    changePair($(elm).val())
    hightlightPair()
    try {
        if($("#menu-otc").hasClass('menu-active')){
            OTC.reload_bid_ask_and_my_order()
        }else if($("#menu-offerbook").hasClass('menu-active')){
            Realtime_market.reload_bid_ask_and_my_order_realtime()
        }
    } catch (error) {
        console.log(error)
    }
}
function select(e, pair){
    $('.info-pair').css("color","#999")
    $(e).find('.info-pair').css("color","white");
    localStorage.setItem("pair", pair)
    
    import_chart()
    changePair(pair)
    try {
        if($("#menu-otc").hasClass('menu-active')){
            OTC.reload_bid_ask_and_my_order()
        }else if($("#menu-offerbook").hasClass('menu-active')){
            Realtime_market.reload_bid_ask_and_my_order_realtime()
        }
    } catch (error) {
        console.log(error)
    }
}

function module_no_support(){
    $("#module_no_ready").modal("show")
}
// Single Page With JS
function getSrcJs(path_router) {
    $("li").removeClass("menu-active")
    switch (path_router) {
        case "en/trade/real-time-market":
            $("#menu-offerbook").addClass('menu-active')
            $('#id_trade_history_otc').hide()
            return '/js/front_end/back_office/order.js';
        case "wallet-currency":
            loadBalance();
            $("#menu-wallet").addClass('menu-active')
            return '/js/front_end/back_office/wallet.js';
        case "order-history":
            $("#menu-history").addClass('menu-active')
            return '';
        case "en/trade/otc":
            $("#menu-otc").addClass('menu-active')
            $('#id_trade_history_otc').show()
            return '/js/front_end/back_office/otc.js';
        case "kyc":
            $("#menu-wallet").addClass('menu-active');
            return '/js/front_end/back_office/kyc.js';
        default :
            return ''
    }
}

function import_js(path) {
    $("#holder > script").remove()
    var script = document.createElement("script");
    if (getSrcJs(path) != ''){
        var version = Math.floor(Math.random()*1000000);
        script.src = getSrcJs(path) + "?version=" + version;
        console.log()
        document.getElementById("holder").appendChild(script)
    }

}
if (window.location.href.split("?").length < 2) {
    
    if (checkValidToken())
        window.location.replace(window.location.protocol + "//" + window.location.host + window.location.pathname + "?token=" + localStorage.getItem("token"))
}

// redirect page
function getPage(path) {

    // history.pushState(window.location.protocol + "//" + window.location.host + path + "?token=" + x,null, window.location.protocol + "//" + window.location.host + path)
    if (path == '/logout'|| !checkValidToken()) {
        localStorage.setItem("token", "")
        window.location.replace(window.location.protocol + "//" + window.location.host + path)
    } else window.location.replace(window.location.protocol + "//" + window.location.host + path + "?token=" + localStorage.getItem("token"))

}

function redirect(path) {
    var data = {
        "path": path
    }
    $.ajax({
        headers: {
            "x-access-token": localStorage.getItem("token")
        },
        url: '/render-module',
        type: 'post',
        data: data,
        success: function (json) {
            import_js(path);
            // getSrcJs(path)
            localStorage.setItem("preivous_path",path)
            $("#sidebar_content > div").remove()
            $("#sidebar_content").html(json);
            console.log(localStorage.getItem("pair"))
            if(localStorage.getItem("pair") == "null"){
                localStorage.setItem("pair","eth-btc");
            }
            changePair(localStorage.getItem("pair"))
            hightlightPair();

        }});
    
}
// hightlinght pair in market pair
function hightlightPair(){
    $('.info-pair').css("color","#999")
    console.log($("#table_market_pair > tbody > tr > .info-pair").length)
    $("#table_market_pair > tbody > tr > .info-pair").each(function(index){
        if($(this).parent().data("pair") == $("#list-pair-real-time-market").val()){
            $(this).css("color","#fff")
            console.log("success")
        }    
    });
}
function addExchangeRate(pair){
    $('.order-exchange-rate').val(localStorage.getItem('pair-'+pair))
}
function init(){
    $.get("https://api.coinmarketcap.com/v2/global/",{ async: false }, function(data){
        $('#total-market-cap').html("$"+Util.format_number_to_show(Util.fix_number(data['data']['quotes']["USD"]['total_market_cap']/1000000,2))+" B")
    });
    $.get("https://api.coinmarketcap.com/v2/ticker/1/?convert=USDT",{ async: false }, function(data){
        data=data["data"]
        $('#last-trade-price-btc').html(Util.format_number_to_show(Util.fix_number(data['quotes']["USD"]['price'],2))+"USD")
        $('#incre-price-24h').html(data['quotes']["USDT"]['percent_change_24h']>0?"+"+data['quotes']["USDT"]['percent_change_24h']+"%":data['quotes']["USDT"]['percent_change_24h']+"%")
        var vol_24h_btc = (data['quotes']['USD']['market_cap']/data['quotes']["USD"]['price'])
        $('#vol-24h').html(Util.format_number_to_show(Util.fix_number(vol_24h_btc,2))+" BTC")
    });
    load_total_daily_transaction()
    if(window.location.pathname == "/en/trade"){
        $.get("https://api.coinmarketcap.com/v2/ticker/1027/?convert=BTC",{ async: false }, function(data){
            console.log(data)
            data=data["data"]
            data["pair-query"] = 'eth-btc'
            data["pair-upcase"] = 'ETH/BTC'    
            data["AllocCurrency"]='BTC'
            localStorage.setItem('pair-eth-btc',parseFloat(data['quotes']['BTC']['price']).toFixed(5))
            var html = Util.market_trading(data)
            
            $("#table_market_pair >tbody").append(html)
        });

        $.get("https://api.coinmarketcap.com/v2/ticker/1/?convert=USDT",{ async: false }, function(data){
            data=data["data"]
            data["pair-query"] = 'btc-usdt'
            data["pair-upcase"] = 'BTC/USDT' 
            data["AllocCurrency"]='USDT'
            var html = Util.market_trading(data)
            localStorage.setItem('pair-btc-usdt',parseFloat(data['quotes']['USDT']['price']).toFixed(5))
            $('#last-trade-price-btc').html(Util.format_number_to_show(Util.fix_number(data['quotes']["USD"]['price'],2)))
            $('#incre-price-24h').html(data['quotes']["USDT"]['percent_change_24h']>0?"+"+data['quotes']["USDT"]['percent_change_24h']+"%":data['quotes']["USDT"]['percent_change_24h']+"%")
            var vol_24h_btc = data['quotes']['USDT']['market_cap'].toFixed(2)/data['quotes']["USD"]['price']
            $('#vol-24h').html(Util.format_number_to_show(Util.fix_number(vol_24h_btc,2)))
            $("#table_market_pair >tbody").append(html)
        });
        $.get("https://api.coinmarketcap.com/v2/ticker/1/?convert=VND",{ async: false }, function(data){
            data=data["data"]
            data["pair-query"] = 'btc-vnd'
            data["pair-upcase"] = 'BTC/VND' 
            data["AllocCurrency"]='VND'
            var html = Util.market_trading(data)
            localStorage.setItem('pair-btc-vnd',parseInt(data['quotes']['VND']['price']))
            
            $("#table_market_pair >tbody").append(html)
        });

        $.get("https://api.coinmarketcap.com/v2/ticker/1027/?convert=USDT",{ async: false }, function(data){
            data=data["data"]
            data["pair-query"] = 'eth-usdt'
            data["pair-upcase"] = 'ETH/USDT' 
            data["AllocCurrency"]='USDT'
            var html = Util.market_trading(data)
            localStorage.setItem('pair-eth-usdt',parseFloat(data['quotes']['USDT']['price']).toFixed(5))

            $("#table_market_pair >tbody").append(html)

            if(localStorage.getItem("pair") == "btc-eth"){
                localStorage.setItem("pair",'eth-btc')
            }
            var x = localStorage.getItem("preivous_path")
            if(x == "kyc") {
                localStorage.setItem("preivous_path","wallet-currency");
                x = "wallet-currency";
            }
            console.log(x)
            if(x != null) redirect(x)
            else redirect("en/trade/otc")
        });
        
    }
}
function load_total_daily_transaction(){
    console.log("load_total_daily_transaction")
    $.ajax({
        headers: {
            "x-access-token": localStorage.getItem("token")
        },
        url: '/api/trade/otc/total-daily-transaction',
        type: 'post',
        data: {},
        success: function (json) {
            try {
                console.log(json)
                if(json['status']==1){
                    $('#total-daily-transaction').html(Util.format_number_to_show(json['total_daily_transaction']))
                }
            } catch (error) {
                console.log(error)
            }
        }
    });
}
function update_active_traders(data){
    try {
        $('#active_trader').html(format_number_int(data['amount']))
    } catch (error) {
        console.log(error)
    }
}
function format_number_int(number){
    var str_tmp = number+""
    var result = ""
    var j = 0;
    for(var i = str_tmp.length-1;i>=0;i--){
        j+=1
        if(j%3==0 && i>0){
            result=","+str_tmp[i]+result
        }else{
            result=str_tmp[i]+result
        }
    }
    return result
}


$(document).ready(function (e) {
    init()
    try {
        var socket = io({path: '/order'});

        socket.on('update_amount_crypto', function (data) {
            console.log(data)
            $("#otp_code").val(data["new_code"])
            $("#notify_key_code").html(`<strong>Notification: </strong> Code <strong>${data["old_code"]}</strong> is used! Tranfer completed`)
        });

        socket.on('code-used', function (data) {
            console.log(data)
            try {
                $('#balance_vnd_deposit_popup').html(Util.format_number_to_show(data['balance']))
                loadBalance()
            } catch (error) {
                console.log(error)
            }
            $("#otp_code").val(data["new_code"])
            $("#notify_key_code").html(`<strong>Notification: </strong> Code <strong>${data["old_code"]}</strong> is used! Tranfer completed`)
        });
        
        // var socket_home = io({path: '/home-page'});
        // socket_home.on('folow_active_traders', function (data) {  
        //     update_active_traders(data);
        //     return false
        // });
    } catch (error) {
        console.log(error)
    }
})