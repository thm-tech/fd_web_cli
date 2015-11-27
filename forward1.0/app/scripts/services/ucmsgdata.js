'use strict';

define(['angular','app'], function(angular,app) {
    app.factory('ucmsgdata',function() {
        var data = [];
        function setData(val) {
            data.unshift(val);
        }
        return {
            data:data,
            setData:setData
        }
    });
});
