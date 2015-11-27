'use strict';

define(['angular','app'], function(angular,app) {
    app.directive('repeatEmit', ['$timeout',function($timeout) {
        return {
            restrict:'A',
            link:function(scope,ele,attrs) {
                console.log('ffffffffff');
                if(scope.$last) {
                    console.log('bbbbbbbbbbb');
                    $timeout(function() {
                        scope.$emit('lastemit');
                    });
                }
            }
        }        
    }]);    
});
