"use strict";define(["angular","app","md5"],function(a,b){b.controller("resetPsw",["$scope","$rootScope","$http","$interval",function(a,b,c,d){document.title="忘记密码 -喵喵熊";var e=a.reset={},f=b.proxyUrl;e.account={},e.verity={},e.resetPsw={},a.shop_id=0,e.templateUrl="views/customer/resetPsw/tpls/account.html";var f=b.proxyUrl,g=Math.random();e.account.imgCaptchaUrl=f+"/basic/captcha?rnd="+g,console.log("randurl,"+e.account.imgCaptchaUrl);var h=new RegExp("^([a-zA-Z]|[一-龥]|[︰-ﾠ])");e.account.changeCaptcha=function(){g=Math.random(),e.account.imgCaptchaUrl=f+"/basic/captcha?rnd="+g},e.account.accountblur=!1,e.account.accountBlur=function(){e.account.account?console.log(h.exec(e.account.account)?"accountttttt,yes":"accountttt,no"):e.account.accountblur=!0},e.account.accountFocus=function(){e.account.accountblur=!1},e.account.captchablur=!1,e.account.captchaBlur=function(){e.account.captcha||(e.account.captchablur=!0)},e.account.captchaFocus=function(){e.account.captchablur=!1,e.account.errCap=!1},e.account.errCap=!1,e.account.verityCaptcha=function(){var a=f+"/basic/captcha";console.log("capurl,"+a);var b={rnd:g,captcha_str:e.account.captcha};e.account.captcha&&e.account.captcha.length>=4?c({url:a,method:"POST",data:b}).success(function(a){a.is_success?(console.log("capsuccess"),e.account.errCap=!1):e.account.errCap=!0}).error(function(){}):e.account.errCap=!1},e.account.postAccount=function(){var b=f+"/merchant/forgetpassword?step=is_account_exist&acc_or_pho="+e.account.account;c.get(b).success(function(b){b.is_exist?(e.verity.phoneNum=b.phone,a.shop_id=b.shop_id,e.templateUrl="views/customer/resetPsw/tpls/verity.html"):console.log("account is not exist")}).error(function(a){console.log("status,"+a)})},e.verity.noteblur=!1,e.verity.noteBlur=function(){e.verity.note||(e.verity.noteblur=!0)},e.verity.noteFocus=function(){e.verity.noteblur=!1,e.verity.noteErr=!1},e.verity.postNote=function(){var a=f+"/merchant/forgetpassword",b={step:"validate_phone_captcha",phone_captcha:e.verity.note,phone:e.verity.phoneNum};console.log("noteeeee,"+b.phone_captcha),c({url:a,method:"POST",data:b}).success(function(a){a.is_success?e.templateUrl="views/customer/resetPsw/tpls/reset.html":e.verity.noteErr=!0}).error(function(){})},e.verity.clicked=!1,e.verity.noteErr=!1,e.verity.sCount=60,e.verity.reSend="重新发送("+e.verity.sCount+")",e.verity.getNote=function(){var b=f+"/merchant/forgetpassword?step=get_phone_captcha&phone="+e.verity.phoneNum;e.verity.clicked=!0,d(function(){e.verity.sCount>1?(e.verity.sCount=e.verity.sCount-1,console.log("cnttttt,"+e.verity.sCount)):(e.verity.clicked=!1,e.verity.sCount=60)},1e3,60),c.get(b).success(function(b){b.is_success&&(a.note=b.captcha)}).error()},a.$watch("reset.verity.sCount",function(a){console.log("kkkkkddd"),e.verity.reSend="重新发送("+e.verity.sCount+")"}),e.resetPsw.incons=!1,e.resetPsw.newblur=!1,e.resetPsw.newBlur=function(){e.resetPsw.newPsw||(e.resetPsw.newblur=!0)},e.resetPsw.newFocus=function(){e.resetPsw.newblur=!1},e.resetPsw.reblur=!1,e.resetPsw.reBlur=function(){e.resetPsw.rePsw||(e.resetPsw.reblur=!0),e.resetPsw.newPsw&&e.resetPsw.rePsw&&e.resetPsw.newPsw!=e.resetPsw.rePsw&&(e.resetPsw.incons=!0)},e.resetPsw.reFocus=function(){e.resetPsw.reblur=!1,e.resetPsw.incons=!1},e.resetPsw.postReset=function(){var b=f+"/merchant/forgetpassword";if(e.resetPsw.newPsw!=e.resetPsw.rePsw)e.resetPsw.incons=!0;else{var d={step:"reset_password",shop_id:a.shop_id,new_password:hex_md5(e.resetPsw.newPsw)};c({url:b,method:"POST",data:d}).success(function(a){a.is_success&&(e.templateUrl="views/customer/resetPsw/tpls/complete.html")}).error(function(){})}}}])});