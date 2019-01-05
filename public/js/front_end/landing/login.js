$('input').focus(function(e){
    $("#message_error").css('display','none');
    $("#message_signup_error").css('display','none');
})
$("#login_form").submit(function(e){
    var formData = {
        'username'      : $('#username').val(),
        'password'      : $('#password').val(),
        'g-recaptcha-response': $('#g-recaptcha-response').val()
    };
    
    Pace.track(function(){
        $('#wrapper').css('opacity',0.5)
        $('input').css('readonly',true);
        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : '/login', // the url where we want to POST
            data        : formData, // our data object
            dataType    : 'json', // what type of data do we expect back from the server
                        // encode          : true
        }).done(function(data) {
            console.log(data); 
            $('#wrapper').css('opacity',1)
            $('input').removeAttr('readonly',true);
            if(data.success==0) {
                $("#message_error").css('display','block');
                $("#message_error").html(data.message);
                grecaptcha.reset();
            }else{
                localStorage.token = data.token
                // console.log("token "+ localStorage.token)
                // alert(localStorage.token);
                getPage("/market");
                // Headers.Headers().append("x-access-token",localStorage.token)
                // window.location.href="/trading"
                
            }
           
        });
    });
    
    e.preventDefault();
})

$("#signup_form").submit(function(e){
    
    var formData = {
        'username'      : $('#username').val(),
        'password'      : $('#password').val(),
        'email'      : $('#email').val(),
        'g-recaptcha-response': $('#g-recaptcha-response').val()
    };
    if($('#password').val()!=$('#confirm-password').val()){
        $("#message_signup_error").css('display','block');
        $("#message_signup_error").html("Check confirm password again, please!")
        return false
    }
    if($('#confirm-rule').val() == false){
        $("#confirm-rule").css('display','block');
        $("#confirm-rule").html("Check Term & Agreement, please!")
        return false
    }
    Pace.track(function(){
        $('#wrapper').css('opacity',0.5)
        $('input').css('readonly',true);
        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : '/signup', // the url where we want to POST
            data        : formData, // our data object
            dataType    : 'json', // what type of data do we expect back from the server encode          : true
        }).done(function(data) {
            console.log(data);
            $('#wrapper').css('opacity',1)
            $('input').removeAttr('readonly',true); 
            if(data.status==0) {
                $("#message_signup_error").css('display','block');
                $("#message_signup_error").html(data.message);
                grecaptcha.reset();
            }else{
                $("#title_signup").html("<span>Congratulation!</span>");
                $("#content_signup").html("You have been successfully signed up. To acticve you account check your mail and confirm you sign up.")
                $("#signup_form").remove();
            }    
        });
    })
    
    e.preventDefault();
})
function checkValiPassword(){
    var pass = $('#password').val()
   
    if(pass.length<8){
        $('#noti-password').html("Password must have length greater than 7 character and !")
        $('#noti-password').css("color","red")
    }else{
        $('#noti-password').html("")
        var variationCount = 0;
        if(pass.length>=16){
            variationCount = 1;
        }
        if(pass.length>=20){
            variationCount = 2;
        }
        
        var variations = {
            digits: /\d/.test(pass),
            lower: /[a-z]/.test(pass),
            upper: /[A-Z]/.test(pass),
            spec: /\-\_/.test(pass),
        }
        for (var check in variations) {
            variationCount += (variations[check] == true) ? 1 : 0;
        }
        if(variationCount<=1){
            console.log("Week, score = "+variationCount)
            $('#noti-password').html("Week!")
            $('#noti-password').css("color","green")
        }else{
            if(variationCount <=3){
                console.log("Normal, score = "+variationCount)
                $('#noti-password').html("Normal!")
                $('#noti-password').css("color","green")
            }else{
                if(variationCount<=5){
                    console.log("Good, score = "+variationCount)
                    $('#noti-password').html("Good!")
                    $('#noti-password').css("color","green")
                }else{
                    console.log("Very Good, score = "+variationCount)
                    $('#noti-password').html("Very Good!")
                    $('#noti-password').css("color","green")
                }
            }
        }
        console.log("score = "+variationCount)
    }
}
function checkConfirmPassword(){
    console.log("checkConfirmPassword")
    var pass = $('#password').val()
    var confirm_pass = $('#confirm-password').val()
    console.log("pass = "+pass)
    console.log("confirm_pass = "+confirm_pass)
    if(pass != confirm_pass){
        console.log(pass != confirm_pass)
        $('#noti-confirm-password').html("Invalid")
        $('#noti-confirm-password').css("color","red")
    }else{
        console.log(pass != confirm_pass)
        $('#noti-confirm-password').html("Corrected")
        $('#noti-confirm-password').css("color","green")
    }
}

function unForcusConfirmPass(){
    console.log("unForcusConfirmPass")
    var pass = $('#password').val()
    var confirm_pass = $('#confirm-password').val()
    console.log(pass != confirm_pass)
    if(pass == confirm_pass){
        $('#noti-confirm-password').html("")
    }
}
function resend(e){
    var email = $(e).data('mail')
    var formData = {
        'email': email
    }
    console.log(formData)
    Pace.track(function(){
        $('#wrapper').css('opacity',0.5)
        $('input').css('readonly',true);
        $.ajax({
            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url         : '/resend', // the url where we want to POST
            data        : formData, // our data object
            dataType    : 'json', // what type of data do we expect back from the server encode          : true
        }).done(function(data) {
            console.log(data);
            $('#wrapper').css('opacity',1)
            $('input').removeAttr('readonly',true);  
            if(data.status ='success'){
                $("#title_signup").html("<span>Congratulation!</span>");
                $("#content_signup").html("You have been resend email actice account. To acticve your account check your mail and confirm you sign up.")
            }else{
                alert(data.message);
            }
        });
    })
}



