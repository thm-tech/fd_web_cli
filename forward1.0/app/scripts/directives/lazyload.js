'use strict';

define(['angular','app'], function(angular,app) {
    app.directive('lazyLoad', ['$document','$window',
        function($document,$window) {
            var $ = function(ele){
       return angular.element(ele);
     }

     var elements = (function(){
         var _uid =0 ;
         var _list = [];

         return {

           push : function(ele){
             _list[_uid ++] = ele ;
           },

           del : function(key){
            _list[key] && delete _list[key] ;
           },

           get : function(){
             return _list  ;
           },

           size : function(){
             return _list.length ;
           }

         }

     })();


     var isVisible = function(ele){
         var  rect = ele[0].getBoundingClientRect();
/*
       if($(window)[0].parent.innerHeight < rect.offsetTop
          &&  $(window)[0].pageYOffset + $(window)[0].parent.innerHeight < rect.offsetTop 
          ||  $(window)[0].pageYOffset >( rect.offsetTop + rect.height)) {
         return false;
       }else{
         return true;
       }*/
         return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth)
         );
     }

     var checkImage = function(){
       var eles = elements.get();
       angular.forEach(eles ,function(v , k){
         isVisible(v.elem) ? v.load(k) : false ;
       })
     }

     var initLazyload = function(scope){
        checkImage();
	    scope.$on('scroll', checkImage);
        window.onresize = checkImage;
     }

     return {
       restrict : 'EA',
       scope : {
       },
       link : function(scope , ele , attrs){
         ele.css({
           'background' : '#fff',
           'opacity' : 0,
           'transition' : 'opacity .2s',
           '-webkit-transition' : 'opacity .2s',
           '-moz-transition' : 'opacity .2s',
           'animation-duration': '.2s'
         })
         elements.push({
           elem : ele ,
           load : function(key){

             ele.attr('src' ,attrs['lazyLoad']);

             ele.on('load' , function(){
               ele.css({
                 'opacity' : '1'
               })
             })

             if(key >=0 ) elements.del(key);
           }
         });

         initLazyload(scope);
       }
     }    	
    }]);		
});
