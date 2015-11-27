'use strict';

define(['angular','app'], function(angular,app) {
    app.directive('scrollOnClick', function() {
        return {
                restrict: 'A',
                link: function(scope, $elm, attrs) {
                var idToScroll = attrs.targettop;
                console.log('iddddddddd,' + idToScroll);
                $elm.on('click', function() {
                    console.log('top click');
                    var $target;
                    if (idToScroll) {
                        console.log('idToScroll');
                        $target = $(idToScroll);
                    } else {
                        $target = $elm;
                    }
                $("body").animate({scrollTop: $target.offset().top}, "slow");
                $("html").animate({scrollTop: $target.offset().top}, "slow");
                });
            }
        };
    });
});
