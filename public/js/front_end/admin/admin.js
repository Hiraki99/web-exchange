function checkValidToken() {
    var x = localStorage.getItem("token");
    console.log(x)
    if (x == "" || x == null || typeof (x) == "undefined") return false
    return true
}
if (window.location.href.split("?").length < 2) {
    if (checkValidToken())
        window.location.replace(window.location.protocol + "//" + window.location.host + window.location.pathname + "?token=" + localStorage.getItem("token"))
}

function getPage(path) {

    // history.pushState(window.location.protocol + "//" + window.location.host + path + "?token=" + x,null, window.location.protocol + "//" + window.location.host + path)
    console.log(path == '/logout' || checkValidToken())
    if (path == '/logout' || !checkValidToken()) {
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
            localStorage.setItem("preivous_path_admin",path)
            $("#sidebar_content > div").remove()
            $("#sidebar_content").html(json);
        }});
    
}
function init(){
    if(window.location.pathname == "/admin"){
        
        var x = localStorage.getItem("preivous_path_admin")
        console.log(x)
        if(x != null) redirect(x)
        else redirect("admin/withdraw")
    }
}
$(document).ready(function (e) {
    init()
})
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

    return [day, month, year].join('-') + ", " + [hours, minutes, seconds].join(':');
}
function detailKyc(e) {
    var host_img = $("#host_image").val()
    console.log(host_img)
    $("#detailInfoKyc").modal("show");
    console.log($(e).data("fullname"))
    console.log($(e).data("id"))
    $("#account_name").val($(e).data("fullname"))
    $("#account_id_verify").val($(e).data("id_verify"))
    $("#account_phone").val($(e).data("phone"))
    $("#img_front").attr("src",host_img+$(e).data("img_front").replace('.',''))
    $("#img_selfie").attr("src",host_img+$(e).data("img_selfie").replace('.',''))
    $("#img_attach").attr("src",host_img+$(e).data("img_with").replace('.',''))
    $("#img_alternative").attr("src",host_img+$(e).data("img_alternative").replace('.',''))
    $("#verify_button").attr("data-id_kyc" , $(e).data("id"));
    console.log($(e).data("id"))
    console.log($("#verify_button").data("id_kyc"))
}
function getError(){
    error = ""
    if($("#tab_phone_false").is(":checked")) error += "phone,"
    if($("#tab_id_verify_false").is(":checked")) error += "id_verify,"
    if($("#tab_fullname_false").is(":checked")) error += "full_name,"
    if($("#tab_imgfront_false").is(":checked")) error += "image_front_verify,"
    if($("#tab_imgselfie_false").is(":checked")) error += "image_selfie_verify,"
    if($("#tab_imgwith_false").is(":checked")) error += "image_with_verify,"
    if($("#tab_imgalter_false").is(":checked")) error += "image_alternative,"
    if (error!= "") error = error.replace(/,$/,"")
    return error

}