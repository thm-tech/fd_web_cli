"use strict";define(["angular","app"],function(a,b){b.directive("ngDoimg",function(){var a=function(a,b,c){b.parent().bind("mouseenter",function(){b.css({display:"block"})}),b.parent().bind("mouseleave",function(){b.css({display:"none"})})};return{restrict:"A",link:a}})});