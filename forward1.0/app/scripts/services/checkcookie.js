'use strict';

define(['angular','app','services/rememberMe'], function(angular,app) {
    app.factory('hascookie',['$location','remember',function($location,remember) {
        function check(accType) {
            console.log(remember.get('globals').accType);
            if(remember.get('globals').accType == accType) {
                return true;
            } else {
                $location.path('/customer/login');  
                return false;
            }
        }
        return {
            check:check                
        }
    }]);
});
