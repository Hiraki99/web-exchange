var data = new FormData()
var currentTab = 0; // Current tab is set to be the first tab (0)
function openID(){
    $("#id_verify_user").modal("show")
}
var x = $(".dz-hidden-input");
console.log($(x[0]).data("parent"))
$("#"+$(x[0]).data("parent")).css("display","block")
if($(".tab").length > 0) $(".title_kyc").css("display","block")
function nextPrev(n) {
    // This function will figure out which tab to display
    var x = $(".dz-hidden-input");
    console.log($(x[currentTab]).data("parent"))
    // Exit the function if any field in the current tab is invalid:
    if ( !ValidateStep(n)) return false;
    // Hide the current tab:
    $("#"+$(x[currentTab]).data("parent")).css("display","none")
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    // if you have reached the end of the form...
    if (currentTab >= x.length) {
        $(".pricing-tables-content > h5").css("display","none")
        $(".verify-upload-document").css("display","block")
        $("#status_verify_info_user").text("ĐANG XÁC THỰC")
        checkKyc(function(checked){
            var url;
            if(checked){
                url ='/account/add-kyc'
            }else {
                url ='/account/update-kyc'
                data["status"] = 0
                data.append("id",$("#id_kyc").val() )
            } 
            // $(".verify-upload-document").remove();
            console.log(data)
            $('#upload-photos').submit(function (event) {
                event.preventDefault()
                console.log(url)
                console.log(data)
                // data = JSON.stringify(data)
                $.ajax({
                    headers: {
                        "x-access-token": localStorage.getItem("token")
                    },
                    contentType: false,
                    processData: false,
                    url: url,
                    type: 'POST',
                    data: data,
                    dataType: 'json',
                    success: function (json) {
                        console.log(json)
                        $(".verify-upload-document").remove();
                    }
                })
            });
            $("#upload-photos").trigger('submit');

        })
    }
    $("#"+$(x[currentTab]).data("parent")).css("display","block")

  }
function checkKyc(callback){
    Pace.track(function () {
        $.ajax({
            headers: {
                "x-access-token": localStorage.getItem("token")
            },
            url: '/account/check-kyc',
            type: 'post',
            contentType: false,
            dataType: 'json',
            success: function (json) {
                if(json.status == -1)
                    callback(true)
                else callback(false)
            }
        });
    })
}
function addVerifyAccount(){
    $("#fullname").prepend($("#account_name").val())
    $("#id_verify").prepend($("#account_number").val())
    $("#phone_number").prepend($("#account_phone").val())
    data.append("fullname",$("#account_name").val())
    data.append("id_verify",$("#account_number").val())
    data.append("phone",$("#account_phone").val())

    $("#id_verify_user").modal("toggle");
}
function getImg(evt){
    var files = evt.files;
    var file = files[0];
    // formdata
    data.append($(evt).data("parent"),file)

    // data[$(evt).data("parent")] = file
    console.log(file.name);
    console.log($(evt).data("parent"))
    nextPrev(1)
}
function ValidateStep(n){
    if(n ==0 && ( ! data["fullname"] || !data["id_verify"])) return false
    return true
}
