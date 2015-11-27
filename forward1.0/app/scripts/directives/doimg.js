'use strict';

define(['angular','app'], function(angular,app) {
    app.directive('ngDoimg',function() {
        var linkFunc = function(scope,element,attrs) {
            element.parent().bind('mouseenter',function() {
                element.css({'display':'block'});    
            });        
            element.parent().bind('mouseleave',function() {
                element.css({'display':'none'});    
            });        
        };
        return {
            restrict: 'A',
            link:linkFunc
        };
    });    
});
