'use strict';

define(['angular','app'], function(angular,app) {
        app.factory('remember', ['$document',function($document) {
            //获取cookie
            function fetchValue(name) {
                var gCookieVal = document.cookie.split('; ');
                console.log('gCookieValllllll,' + gCookieVal);
                for (var i=0,len=gCookieVal.length; i < len; i++) {
                    var gCrumb = gCookieVal[i].split('=');
                    if (name === gCrumb[0]) {
                        var value = '';
                        try {
                            value = gCrumb[1].substring(0,gCrumb[1].length-1);
                            value = value.substr(1,value.length-1);
                            value = strToObj(value);
                        }
                        catch(e) {
                        console.log('gCrumb,' + gCrumb[1]);
                            value = decodeURIComponent(gCrumb[1]);
                            value = value.substring(0,value.length-1);
                            value = value.substr(1,value.length-1);
                            value = strToObj(value);
                            console.log(value);
                        }
                        return value;
                    }
                }
                return null;
            }
            //对象转字符串
            function objToStr(obj) {
                var cookieStr = '';
                if(typeof obj === 'object') {
                    angular.forEach(obj,function(v,k) {
                        cookieStr += k + '|' + encodeURIComponent(v) + ',';         
                    }); 
                }
                return cookieStr; 
            }
            //字符串转对象
            function strToObj(str) {
                var cookieObj = {};
                if(typeof str === 'string') {
                    console.log('strrrrrrrrrrrrrr,' + str);
                    var gValue = str.split(',');
                    console.log('gvalueeeeeeeeeeeeee,' + gValue);
                    for(var i=0,len=gValue.length; i<len; i++) {
                        var gSingle = gValue[i].split('|');
                        cookieObj[gSingle[0]] = decodeURIComponent(gSingle[1]);
                    }
                }
                console.log('cookieObj,');
                console.log(cookieObj);
                return cookieObj;
            }
            //生成cookie
            function putValue(name,values) {
            /*
                if(arguments.length === 1) {
                    return fetchValue(name);
                }    */
                var cookie = name + '=';
                var _cookie = '';
                if(typeof values === 'object'){
                    console.log('this is object');
                    var expires = '';
                    console.log('the value is ,' + angular.toJson(values.value));
                    cookie += '"' + ((typeof values.value === 'object') ? objToStr(values.value) : values.value + ';') + '"';
                    if(values.expires) {
                        var date = new Date();
                        date.setTime( date.getTime() + (values.expires * 24 *60 * 60 * 1000));
                        expires = date.toGMTString();
                        console.log('expires,' + expires);
//                        cookie += 'expires=' + expires + ';';
                    }
                    cookie += (values.expires) ? ' ;expires=' + expires + ';' : '';
                    cookie += (values.path) ? ' path=' + values.path + ';' : '';
                    cookie += (values.secure) ? ' secure;' : '';
                    console.log('cookieeeeeeeeeeeee,' + cookie); 

                } else {
                    console.log('this is not object');
                    cookie += values + ';';
                }
                document.cookie = cookie;
                console.log('cookie,' + cookie); 
                console.log('document.cookie,' + document.cookie);
            }
            //删除cookie
            function removeValue(name) {
                var date = new Date();
                date.setTime(date.getTime() - 1000);
                var cVal = fetchValue(name);
                if(cVal) {
                    document.cookie = name + '=' + cVal + '; expires=' + date.toGMTString();
                }
            }

            return {
                get:fetchValue,
                put:putValue,
                remove:removeValue
            };
        }]);
});
