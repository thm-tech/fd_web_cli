"use strict";define(["angular","app"],function(a,b){b.directive("repeatEmit",["$timeout",function(a){return{restrict:"A",link:function(b,c,d){console.log("ffffffffff"),b.$last&&(console.log("bbbbbbbbbbb"),a(function(){b.$emit("lastemit")}))}}}])});