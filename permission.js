const url = require('url'); // built-in utility
// res.redirect(url.parse(req.url).pathname);
const permision_anonymous=[{
    role: '/'
},{
    role: '/login'
},{
    role: '/signup'
},{
    role: '/resend'
},{
    role: '/confirmaccount'
},{
    role: '/blog'
},
{
    role: '/chart'
},
{
    role: '/market'
},{
    role: '/en'
}] 
function checkPermisionAnonymous(url_request){
    var check = 0;
    var url_parent_check;
    if(url_request != '/')
        url_parent_check = '/'+url_request.split('/')[1]
    else url_parent_check = url_request
    permision_anonymous.forEach(item=>{
        if(item.role == url_parent_check)
            check = 1;
    })
    if(check ==0)
        return false
    else 
        return true
}
function checkPermission(url_request,list_permision){
    var check = 0;
    var url_parent_check;
    url_request = url.parse(url_request).pathname;
    if(url_request != '/')
        url_parent_check = '/'+url_request.split('/')[1]

    else url_parent_check = url_request
    list_permision.forEach(item=>{
        if(item.role == url_parent_check)
            check = 1;
    })
    if(check ==0)
        return false
    else 
        return true
}
function checkBlackList(blacklist, token){
    var check = 0;

    blacklist.forEach(item=>{
        if(item == token)
            check = 1;
    })
    if(check == 0)
        return true
    else 
        return false
}

function checkTokenValidate(token,blacklist){
    // console.log("token "+token)
    if(typeof token != 'undefined' && token != null && token !=""){
        if (checkBlackList(blacklist,token)) return true
    }
    else return false
}

exports.checkPermisionAnonymous = checkPermisionAnonymous
exports.checkPermission = checkPermission
exports.checkBlackList = checkBlackList
exports.checkValidateToken = checkTokenValidate


