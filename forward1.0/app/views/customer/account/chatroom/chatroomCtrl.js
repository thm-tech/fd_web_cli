'use strict';

var SHOP_TYPE = 'shop';
var GROUP_TYPE = 'group';
var E2E_TYPE = 'e2e';

function ChatRoom(roomName){
    var _this = this;
    this.users = [];
    this.userNum = 0;
    this.owner = 0;
    this.roomImg = 'http://img.immbear.com/5aaf3dc86282f48d336104a922533f1f.jpeg';
    this.roomName = roomName;
    this.roomNickName = 'www.miaomiaox.com';
    this.roomType = '';
    this.messages = [];
    this.messageNum = 0;
    this.newMessageNum = 0;
    this.haveNewMessage = false;
    this.newesetMessage = '';
}

ChatRoom.prototype = {
    constructor:ChatRoom,
};

function ChatUser(userId){
    var _this = this;
    this.userId = userId;
    this.userName = '';
    this.userPortrait = '';
    this.friendName = '';
    this.gender = 0;
    this.mcode = '';
    this.phoneNo = '';
    this.cityId = '';
    this.isMyfriend = false;
    this.birthday = '';
    this.cityName = '';

    this.setUserInfo = function(userName, userPortrait){
        _this.userName = userName;
        if (_this.friendName == ""){
            _this.friendName = userName;
        }
        _this.userPortrait = userPortrait;
    };
}

ChatUser.prototype = {
    constructor:ChatUser,
};

define(['angular','app','services/checkcookie'], function(angular,app) {
    app.controller('userChatCtrl', ['hascookie','$interval','$document','FileUploader','$scope','$rootScope','$http','$sce',
        function(hascookie,$interval,$document,FileUploader,$scope,$rootScope,$http,$sce) {

    var msgChange = 0;

    var currentUser = $rootScope.globals.userID;
    var passwd = $rootScope.globals.password;

    //var IP_PORT = "115.28.143.67:8889";
    //var SHOP_IP_PORT = "115.28.143.67:8887";
    var IP_PORT = $rootScope.chatProxyUrl;
    var WS_IP_PORT = $rootScope._chatProxyUrl;
    var SHOP_IP_PORT = $rootScope.proxyUrl;
    var _this = this;

    $scope.currentUser = currentUser;

    $scope.chatMessage='';

    console.log('current user:' + currentUser + passwd);

    var wsServer = 'ws://'+WS_IP_PORT+'/chat/';
    var websocket;

    function wsInit(){
        websocket = new WebSocket(wsServer + '?u='+currentUser+'&p='+ passwd);
        console.log("new websocket:"+websocket);
        websocket.onclose = function(evt){ onClose(evt); };
        websocket.onopen = function(evt){onOpen(evt);};
        websocket.onmessage = function(evt){onMessage(evt);};
        websocket.onerror = function(evt){onError(evt);};
    };

    wsInit();
    var interId;

    var logoutFlag = 0;

    $scope.$on("logout", function(){
        websocket.close();
        logoutFlag = 1;
    });

    var send = function(data){
            console.log('sendmessage:'+JSON.stringify(data));
            websocket.send(JSON.stringify(data));
        };

    function onOpen(evt){
        console.log("connected to websocket server." + wsServer);
        //send({c:'SHOP_GNAME', sid:currentUser});
        //$interval.cancel(interId);
        send({c:'USER_GROUPS', user:currentUser});
        $scope.chatUsers.getUserInfo(currentUser, null, null);
        $scope.chatUsers[currentUser].friendName = $scope.chatUsers[currentUser].userName;
    }

    function onClose(evt){
        console.log("disconnected"+evt.code);
        //$interval.cancel(interId);
        //interId = $interval(wsInit,5000);
        var windows = (navigator.userAgent.indexOf("Windows",0) != -1) ?1:0;
        if (windows && (navigator.userAgent.indexOf("Safari")>0)){
            console.log('safari on windows get out');
            return;
        }
        if (!logoutFlag) {
            setTimeout(wsInit,30000);
        } else {
            logoutFlag = 0;
        }
    }


    function onError(evt){
        console.log('error occured:'+evt.data);
    }

    $scope.showEmoji = function(emoji_status){
        if(emoji_status != $scope.chat_emoji_status){
            $scope.chat_emoji_status = emoji_status;
        }
    };
    $scope.showRoomUsersInfo = function(room){
        //if room type e2e
        //if room type shop or group 
        /*
        if ($scope.chatRooms[room].roomType == 'SHOP_TYPE' || $scope.chatRooms[room].roomType) {
            //getRoomUsersInfo
        }
        */
        if(!hascookie.check('cm')){
            return;
        }
        $scope.getUserFriends(currentUser);
        console.log('room:'+room);
        console.log('room.type:'+room.slice(0 ,5));
        if (room.slice(0, 4) == 'shop' || room.slice(0,5) == 'users') {
            send({
                'c':'GROUP_USERS',
                'gname':room
            });
        }
    };

    $scope.friendsObj = {
        /*
         * url:/userweb/(\w+)/friends
         * */
    };

    $scope.chatChangeFriendName = function(name){
        var friendId = $scope.chatRooms[$scope.currentRoomName].users[1];
        var url = SHOP_IP_PORT + '/userweb/'+currentUser+'/friend/remark';
        console.log('change friend name'+'id:'+friendId+'name:'+name+'you:'+currentUser);
        var data = {
            'friend_id':friendId,
            'remark':name
        };
        $http.post(url, JSON.stringify(data));
        $scope.chatRooms[$scope.currentRoomName].roomNickName = name;

        /*
        $scope.friendsList = [
            ['A',[]],['B',[]],['C',[]],['D',[]],['E',[]],['F',[]],['G',[]],['H',[]],['I',[]],['J',[]],['K',[]],['L',[]],['M',[]],['N',[]],['O',[]],['P',[]],['Q',[]],['R',[]],['S',[]],['T',[]],['U',[]],['V',[]],['W',[]],['X',[]],['Y',[]], ['Z',[]],
        ];
        $scope.getUserFriends(currentUser);
        */
    };

    $scope.selectedFriendList = [];

    $scope.createfriendsChatRoom = function(friend){
        if (friend.flag) {
            $scope.selectedFriendList.push(friend.id);
        } else {
            var fIndex = $scope.selectedFriendList.indexOf(friend.id);
            $scope.selectedFriendList.splice(fIndex, 1);
        }
        console.log('selectedFriendList:'+$scope.selectedFriendList);
    };


    $scope.createfriendsChatRoomOk = function(selectedFriendList){
        //send create room command to chat server, when get response add new room in roomlist and change chat_sfp_flag to 's'
        if (selectedFriendList.length > 1){
            send({
                'c':'PULL_US',
                'master':currentUser,
                'clients':selectedFriendList
            });
        } else {
            $scope.chat_invite_chat(selectedFriendList[0]);
        }
    };

    $scope.chat_sfp_flag = 's';

    $scope.friendsList = [
        ['A',[]],['B',[]],['C',[]],['D',[]],['E',[]],['F',[]],['G',[]],['H',[]],['I',[]],['J',[]],['K',[]],['L',[]],['M',[]],['N',[]],['O',[]],['P',[]],['Q',[]],['R',[]],['S',[]],['T',[]],['U',[]],['V',[]],['W',[]],['X',[]],['Y',[]], ['Z',[]],
    ];

    var friendsListFlags = [];

    var friendsListPush = function(ch, userId){
        var flag = 0;
        for (var i=0; i < $scope.friendsList.length; i++){
            if(ch == $scope.friendsList[i][0]){
                if (friendsListFlags.indexOf(userId) == -1){
                    $scope.friendsList[i][1].push({'id':userId, 'flag':false});
                    friendsListFlags.push(userId);
                }
                flag = 1;
                break;
            }
        }
        if (flag == 0){
            $scope.friendsList.push([ch,[{'id':userId, 'flag':false}]]);
        }

        console.log('friendList:'+JSON.stringify($scope.friendsList));
    };

    $scope.getUserFriends = function(userId){
        var url =SHOP_IP_PORT +'/userweb/' + userId +'/friends';
        $http.get(url).success(function(data, status, headers, config){
            console.log('get user friends:' + JSON.stringify(data));

            for (var fs in data.friends){
                console.log(fs);
                for (var u = 0; u < data.friends[fs].length; u++){
                    var userId = data.friends[fs][u].friend_id;

                    if ($scope.chatUsers.hasOwnProperty(userId)){
                        var userInfo = $scope.chatUsers[userId];
                    } else {
                        var userInfo = new ChatUser(userId);
                    }

                    userInfo.userName = data.friends[fs][u].name;
                    userInfo.userPortrait = data.friends[fs][u].portrait_url;
                    if (data.friends[fs][u].friend_name != '') {
                        userInfo.friendName = data.friends[fs][u].friend_name;
                    } else {
                        userInfo.friendName =data.friends[fs][u].name;
                    }

                    userInfo.gender=data.friends[fs][u].gender;

                    userInfo.mcode = data.friends[fs][u].mcode;
                    userInfo.phoneNo = data.friends[fs][u].phone_no;
                    userInfo.cityId = data.friends[fs][u].city_id;
                    userInfo.isMyfriend = true;
                    userInfo.birthday = data.friends[fs][u].birthday;
                    userInfo.cityName = data.friends[fs][u].city_name;

                    if (!userInfo.userName  && !userInfo.friendName ){
                        userInfo.userName = 'www.maiomiaox.com';
                    }
                    $scope.chatUsers[userId] = userInfo;
                    console.log(JSON.stringify(userInfo));
                    friendsListPush(fs, userId);
                }
            }

        });  
    };

    $scope.changeCurrentRoom = function(room){
        $scope.currentRoomName = room;
        /*
        if (room != _this.shop_gname)
        {
            var index = $scope.chatRoomList.indexOf(room);
            $scope.chatRoomList.splice(index,1);
            $scope.chatRoomList.splice(1,0,room);
        }
        */
        $scope.chat_room_user_info_tab = false;

        setTimeout(function(){
            document.getElementById("chatwindow").scrollTop=100000000;
        },200);
    }

    var getOldestTime = function(){
        //var oldM = getRoomOldestMessage(_this.shop_gname);
        var oldM = getRoomOldestMessage($scope.currentRoomName);
        console.log("oldest message :"+JSON.stringify(oldM));
        return oldM.time
    };

    var getMoreMessageFlag = false;
    var noMoreMessage = false;
    $scope.newScrollHeight = 0;

    var oldScrollHeight = 0;
    var f = true;

    document.getElementById("chatwindow").onscroll = function(){

        var scrollTop = document.getElementById("chatwindow").scrollTop;
        if(scrollTop < 500){
            getMoreMessageFlag = true;
        }
        if (getMoreMessageFlag == true){

            $scope.newScrollHeight = document.getElementById("chatwindow").scrollHeight;

            console.log('newscrollHeight:'+$scope.newScrollHeight + 'oldScrollHeight;'+oldScrollHeight);

            if ($scope.newScrollHeight > oldScrollHeight && oldScrollHeight != 0){
                document.getElementById("chatwindow").scrollTop = $scope.newScrollHeight - oldScrollHeight + 300;
                oldScrollHeight = $scope.newScrollHeight;
                f = true;
                console.log('scrollTop:'+document.getElementById("chatwindow").scrollTop);
            } else if (oldScrollHeight == 0){
                oldScrollHeight = $scope.newScrollHeight;
            }

            if (document.getElementById("chatwindow").scrollTop < 500 && !noMoreMessage && f){
                f = false;
                var oldestTime = getOldestTime();
                getMoreMessageFlag = true;
                send({
                    'c':'GET_RECORD',
                    'gname':$scope.currentRoomName,
                    'stime':oldestTime,
                    'limit':30
                });
                console.log('getnewrecord:'+oldestTime);
            }
        }
    };

    $scope.chatRooms = {
            /*
             * gname : new ChatRoom(gname)
             * */
            //e2e_10238:{roomName:'e2e_10238', roomType:E2E_TYPE, messages:[{mtype:'text',m:'hello world',user:'10238',time:1422722271000}], users:[10238], haveNewMessage:true},
        };
    var setChatRoom = function(roomName){
        if($scope.chatRooms.hasOwnProperty(roomName)){
            console.log('user id ' + roomName + 'is already in chat rooms');
            return;
        }
        var chatRoom = new ChatRoom(roomName);
        if (roomName.slice(0,3) == E2E_TYPE){
            chatRoom.roomType = E2E_TYPE;
        } else if (roomName.slice(0,4) == SHOP_TYPE){
            chatRoom.roomType = SHOP_TYPE;
        }else if (roomName.slice(0,5) == GROUP_TYPE) {
            chatRoom.roomType = GROUP_TYPE;
        }
        chatRoom.roomName = roomName;
        $scope.chatRooms[roomName] = chatRoom;
        console.log('chatrooms:'+JSON.stringify($scope.chatRooms));
    };

    var addChatRoomUser = function(roomName, user) {
        user = ""+user;
        if ($scope.chatRooms[roomName].users.indexOf(user) != -1){
            return;
        }
        $scope.chatRooms[roomName].users.push(user);
        $scope.chatRooms[roomName].userNum++;
        console.log('chatroomusers:'+JSON.stringify($scope.chatRooms[roomName].users))
    };

    var setRoomMessages = function(roomName, messages) {
        $scope.chatRooms[roomName].messages = messages;
    };

    var addRoomMessage = function(roomName, message) {
        $scope.chatRooms[roomName].messages.push(message);
        if(roomName != $scope.currentRoomName){
            $scope.chatRooms[roomName].haveNewMessage = true;
            $scope.chatRooms[roomName].newMessageNum++;
            $rootScope.messageNum ++;
            msgChange ++;
            $scope.$emit('msgChange',msgChange);
            console.log('changeMessageNum:',msgChange);
        }
        $scope.chatRooms[roomName].messageNum++;
        console.log('addroommessage:'+roomName+' '+message +' newmessagetotal:'+msgChange);
    };

    var addRoomMessageHead = function(roomName, message){
        $scope.chatRooms[roomName].messages.splice(0,0,message);
        $scope.chatRooms[roomName].messageNum++;
    };

    var getRoomOldestMessage = function(roomName) {
        return $scope.chatRooms[roomName].messages[0];
    };

    var setHaveNewMessage = function(roomName) {
        $scope.chatRooms[roomName].haveNewMessage = true;
    };

    var clearNewMessage = function(roomName){
        $scope.chatRooms[roomName].haveNewMessage = false;
    };

    var getRoomType = function(roomName){
        return $scope.chatRooms[roomName].roomType;
    };

    var getRoom = function(roomName){
        return $scope.chatRooms[roomName];
    };

    $scope.getNewestMessage = function(room){
        if (room.messages.length == 0){
            return;
        }
        var newM = room.messages.slice(-1);
        return newM[0].m;
    }

    var exitGroup = function(gname, user){
            var index = $scope.chatRooms[gname].users.indexOf(""+user);
            if(index == -1){
                return;
            }
            $scope.chatRooms[gname].users.splice(index,1);
            $scope.chatRooms[gname].userNum--;
            console.log('userexitroom:',JSON.stringify($scope.chatRooms[gname]));
            $scope.$digest();
        }

    $scope.readMessage = function(room){
        $scope.chatRooms[room].haveNewMessage = false;
        console.log('roomnewmessagenum:'+$scope.chatRooms[room].newMessageNum);
        $rootScope.messageNum -= $scope.chatRooms[room].newMessageNum;
        msgChange -=  $scope.chatRooms[room].newMessageNum;
        $scope.$emit('msgChange',msgChange);
        $scope.chatRooms[room].newMessageNum = 0;

        console.log('newmessagetotal:'+msgChange);
    };


    $scope.chatUsers = {
        /*
         * userId: new ChatUser(userId)
         * */
        //'10238':{userId:10238, userName:'htfang', userPortrait:'http://img.immbear.com/e594ed9d8159cef335c0250784aa1374.png', isFans:true},
        getUserInfo:function(userId, callBack, argument){
            if($scope.chatUsers.hasOwnProperty(userId)){
                console.log('user id ' + userId + 'is already in users');
                if (callBack){
                    callBack(argument);
                }
                return;
            } else {
                var userInfo = new ChatUser(userId);
                $scope.chatUsers[userId] = userInfo;

                var url =IP_PORT +'/chat/user/' + userId +'/info';
                $http.get(url).success(function(data, status, headers, config){
                    console.log('get user infoo:' + JSON.stringify(data));
                    if ('error' in data){
                        return;
                    }    
                    userInfo.setUserInfo(data.name, data.img);
                    $scope.chatUsers[userId] = userInfo;
                    console.log('chatusers info:' + JSON.stringify($scope.chatUsers));
                    if (callBack){
                        callBack(argument);
                    }
                    return userInfo;
                });  
            }    
        },   
    };

    $scope.chatRoomList = [];
    var addChatRoomListHead = function(roomName){
        if($scope.chatRoomList.indexOf(roomName) == -1){
            $scope.chatRoomList.splice(0,0,roomName);
        }
        console.log('chatroomlist:'+JSON.stringify($scope.chatRoomList));
    };
    var addChatRoomList = function(roomName){
        if($scope.chatRoomList.indexOf(roomName) == -1){
            $scope.chatRoomList.push(roomName);
        }
        console.log('chatroomlist2:'+JSON.stringify($scope.chatRoomList));
    };

    $scope.chatUsers.getUserInfo(currentUser, null, null);

    var sendMessage = function(body, type){
        if(body=='' || !body){
            console.log('body is null');
            return;
        }
        var message_body = {
            'user':$scope.currentUser,
            'time':Date.parse(new Date()),
            'mtype':type,
            'm':body
        };
        send({
            'c':'CHAT_M',
            'gname':$scope.currentRoomName,
            'body':message_body
        });
    };

    $scope.sendMessage = function(){
        if(!hascookie.check('cm')){
            return;
        }
        console.log('messagee:'+$scope.chatMessage);
        sendMessage($scope.chatMessage,'text');
        $scope.chatMessage = '';
    };

    $scope.enterKeySendMessage = function(evt){
        if (evt.ctrlKey&&evt.keyCode == 13){
            $scope.sendMessage();
        }
    };

    var _freshMessage = function(){
            $scope.$digest();
            if (false == getMoreMessageFlag){
                setTimeout(function(){
                    document.getElementById("chatwindow").scrollTop=100000000;
                },200);
            } 
        };

    function onMessage(evt){
        console.log('retrieved data from server:' + evt.data);
        _this.data_json = JSON.parse(evt.data);
        _this.data = evt.data;
        console.log('command:'+ _this.data_json.c);
        switch( _this.data_json.c)
        {
            case 'GET_RECORD':getRecords();break;
            case 'CHAT_M':getMessage();break;
            case 'GROUP_USERS':getRoomUsers();break;
            case 'ENTR_SHOP':
            case 'ENTR_GROUP':userEnterRoom();break;
            case 'EXIT_G':userExitShop();break;
            case 'INVITE':pullUserInRoom();break;
            case 'ADD_FRIEND':
            case 'CON_FRIEND':
            case 'SEND_FANS_M':emitToMsgCtrl();break;
            case 'SHAKE_KEYS':matchUserByKeys();break;
            case 'USER_GROUPS':getUserGroups();break;
        }
    }

    var getRoomsDefaultInfo = function() {
            var url = '';
            for (var i = 0; i < _this.data_json.groups.length; i++) {
                url =IP_PORT +'/chat/room/' + _this.data_json.groups[i]+'/info';
                $http.get(url).success(function(data, status, headers, config){
                    console.log('get roominfo'+JSON.stringify(data));
                    if (data.hasOwnProperty('eroor')) {
                        console.log('roominfo error')
                        return
                    }
                    var chatRoom = new ChatRoom(data.gname);
                    $scope.chatRooms[data.gname] = chatRoom;
                    addChatRoomListHead(data.gname);
                    $scope.currentRoomName = data.gname;
                 
                    $scope.chatRooms[data.gname].roomNickName = data.roomName;
                    $scope.chatRooms[data.gname].roomImg = data.roomImg;
                    $scope.chatRooms[data.gname].owner = data.owner;
                });
            }
        };

    var getUserGroups = function() {
            getRoomsDefaultInfo();
            $scope.chat_sfp_flag  = 's';
        };

    var matchUserByKeys = function(){
            var newMatchUser = new ChatUser(_this.data_json.user);
            newMatchUser.cityId = _this.data_json.info.cityId;
            newMatchUser.gender = _this.data_json.info.gender;
            newMatchUser.userName = _this.data_json.info.name;
            newMatchUser.userPortrait = _this.data_json.info.img;

            $scope.chatUsers[_this.data_json.user] = newMatchUser;

            $scope.chat_found_user = _this.data_json.user;
            $scope.chat_add_friend_tab_flag = 'u';
            $scope.$digest();
        };

    var emitToMsgCtrl = function(){
            $scope.$emit('UcMsgChannel', _this.data_json);
            console.log('emit to ucmsgChannel');
        };

    var pullUserInRoom = function(){
            send({
                'c':'ACCEPT',
                'gname':_this.data_json.gname
            });

            var chatRoom = new ChatRoom(_this.data_json.gname);
            $scope.chatRooms[_this.data_json.gname] = chatRoom;

            for(var c=0; c<_this.data_json.users.length; c++){
                console.log('addroomusers:'+c+' '+_this.data_json.users[c]);
                addChatRoomUser(_this.data_json.gname, _this.data_json.users[c]);
                $scope.chatUsers.getUserInfo(_this.data_json.users[c], null, null);
            }
            //update group img and nick name when user portrait not load maybe has problem WARN
            $scope.chatRooms[_this.data_json.gname].roomImg = $scope.chatUsers[_this.data_json.users[0]].userPortrait;
            $scope.chatRooms[_this.data_json.gname].roomNickName = $scope.chatUsers[_this.data_json.users[0]].friendName +','+$scope.chatUsers[_this.data_json.users[1]].friendName +','+ $scope.chatUsers[_this.data_json.users[2]].friendName;
            //set default room info 
            if (_this.data_json.users[0] == currentUser){
                setRoomDefaultInfo(_this.data_json.gname, $scope.chatRooms[_this.data_json.gname].roomNickName,
                    $scope.chatRooms[_this.data_json.gname].roomImg, _this.data_json.users[0]);
            }

            addChatRoomListHead(_this.data_json.gname);
            $scope.chat_sfp_flag  = 's';
            $scope.currentRoomName = _this.data_json.gname;

            $scope.$digest();
        };

    var userAddFriend = function(){
            console.log('invite add you');
        };

    var userConFriend = function(){
            //update friends list
            //add new friend in session
            $scope.chat_invite_chat(_this.data_json.receiver);
        };

    $scope.currentRoomName = '';
    /*
    var getShopRoomName = function(){
            _this.shop_gname = _this.data_json.gname;
            console.log('get shop group name :' + _this.shop_gname);
            $scope.currentRoomName = _this.shop_gname;
            setChatRoom(_this.shop_gname);
            addChatRoomListHead(_this.shop_gname);
            addChatRoomUser(_this.shop_gname, currentUser);
            send({
                'c':'GET_RECORD',
                'gname':_this.shop_gname,
                'stime':Date.parse(new Date()),
                'limit':30
            });
            send({
                'c':'ENTR_SHOP',
                'user':currentUser,
                'gname':_this.shop_gname
            });
            send({
                'c':'GROUP_USERS',
                'gname':_this.shop_gname
            });
        };
    */

    var getRecords = function(){
            if(_this.data_json.ms.length < 30){
                noMoreMessage = true;
            }
            for(var m = 0; m<_this.data_json.ms.length; m++){
                _this.data_json.ms[m].type = _this.data_json.ms[m].mtype.slice(0,5);
                _this.data_json.ms[m].trustUrl = $sce.trustAsResourceUrl(_this.data_json.ms[m].m);
                //console.log("record:"+_this.data_json.ms[m].m);

                $scope.chatUsers.getUserInfo(_this.data_json.ms[m].user, null, null);
                addRoomMessageHead(_this.data_json.gname, _this.data_json.ms[m]);
            }
            _freshMessage();
        };

    $scope.chat_add_as_friend = function(chat_found_user, currentUser){
        console.log('add_as_friend:'+chat_found_user+currentUser);

        var data = {
                'mode':3,
                'phone':'',
                'mcode':'',
                'userID':chat_found_user,
                'remark':''
            };
        var url =SHOP_IP_PORT + '/user/friend/invite';
        $http.post(url, JSON.stringify(data)).success(function(data, status, headers, config){
            if (''+data.err == '0'){
                $scope.chat_invite_chat(chat_found_user);
            }
        }); 
    };

    function sleep(milliSeconds){
        var startTime = new Date().getTime(); // get the current time
        while (new Date().getTime() < startTime + milliSeconds); // hog cpu
    }

    var getMessage = function(){
            var m = _this.data_json.body;
            m.type = m.mtype.slice(0,5);
            if ($scope.chatRooms.hasOwnProperty(_this.data_json.gname)){
            } else {
                var chatRoom = new ChatRoom(_this.data_json.gname);
                $scope.chatRooms[_this.data_json.gname] = chatRoom;
            }

            function _callback(data_json) {
                if (data_json.gname.slice(0,3) == 'e2e') {
                    var us = data_json.gname.split('_');
                    if (us[1] == currentUser) {
                        var u = us[2];
                    } else {
                        var u = us[1];
                    }
                    $scope.chatRooms[data_json.gname].roomNickName = $scope.chatUsers[u].userName;
                    $scope.chatRooms[data_json.gname].roomImg = $scope.chatUsers[u].userPortrait;
                }
            }

            var message_obj = _this.data_json;

            $scope.chatUsers.getUserInfo(m.user, _callback, message_obj);

            if (m.mtype == 'mmx/goods' || m.mtype == 'mmx/shop' || m.mtype == 'mmx/act'){
                m.m.trustUrl = $sce.trustAsResourceUrl(m.m.img);
                $scope.chatRooms[_this.data_json.gname].newesetMessage = m.m.name;
            } else {
                m.trustUrl = $sce.trustAsResourceUrl(m.m);
                console.log("roomname:"+_this.data_json.gname+'mmmmmmtype:'+m.mtype+' m.m:'+m.m+" m.trust:"+m.trustUrl);

                $scope.chatRooms[_this.data_json.gname].newesetMessage = m.m;
            }

            setChatRoom(_this.data_json.gname);
            if ($scope.chatUsers.hasOwnProperty(m.user)){
                addRoomMessage(_this.data_json.gname, m);
            } else {
                send({
                    'c':'GET_RECORD',
                    'gname':_this.data_json.gname,
                    'stime':100000000000000,
                    'limit':30
                });
                addRoomMessage(_this.data_json.gname, m);
                $scope.chatRooms[_this.data_json.gname].messages.pop();
            }
            $scope.chatUsers.getUserInfo(m.user, null, null);
            //addChatRoomUser(_this.data_json.gname, m.user);
            addChatRoomList(_this.data_json.gname);
            getMoreMessageFlag = false;
            _freshMessage();
        };


    var setRoomDefaultInfo = function(gname, roomName, roomImg, owner) {
            var url =IP_PORT +'/chat/room/' + gname+'/info';
            console.log('setRoomDefaultInfo'+roomName);
            var data = {
                    'roomName':roomName,
                    'roomImg':roomImg,
                    'owner':owner
                };
            $http.post(url, JSON.stringify(data)).success(function(data, status, headers, config){
            });
        };
    //WARN when query room users room info maybe modify
    var getRoomUsers = function(){
            console.log('---addroomusers:'+JSON.stringify(_this.data_json.users));
            for(var c=0; c<_this.data_json.users.length; c++){
                console.log('addroomusers:'+c+' '+_this.data_json.users[c]);
                addChatRoomUser(_this.data_json.gname, _this.data_json.users[c]);
                $scope.chatUsers.getUserInfo(_this.data_json.users[c], applyIt, null);
            }
            //update group img and nick name when user portrait not load maybe has problem WARN
            //$scope.chatRooms[_this.data_json.gname].roomImg = $scope.chatUsers[_this.data_json.users[0]].userPortrait;
            //$scope.chatRooms[_this.data_json.gname].roomNickName = $scope.chatUsers[_this.data_json.users[0]].friendName +','+$scope.chatUsers[_this.data_json.users[1]].friendName +','+ $scope.chatUsers[_this.data_json.users[2]].friendName;
            //set default room info 
            /*
            setRoomDefaultInfo(_this.data_json.gname, $scope.chatRooms[_this.data_json.gname].roomNickName,
                $scope.chatRooms[_this.data_json.gname].roomImg, _this.data_json.users[0]);
            */
            function applyIt(a){
                $scope.$digest();
            };
        };

    var userEnterRoom = function(){
            addChatRoomUser(_this.data_json.gname, _this.data_json.user);
            $scope.chatUsers.getUserInfo(_this.data_json.user, null, null);
            $scope.$digest();
        };

    var userExitShop = function(){
            exitGroup(_this.data_json.gname, _this.data_json.user);
        };


    var getE2eRoomName = function(u1, u2){
        if (u1 > u2){
            return 'e2e_' + u1+ '_' + u2;
        } else {
            return 'e2e_' + u2+ '_' + u1;
        }
    };
    $scope.chat_invite_chat = function(user){
        console.log('invitechat:'+user);
        var e2eRoomName = getE2eRoomName(user,$scope.currentUser);
        addChatRoomListHead(e2eRoomName);

        var newE2eChatRoom = new ChatRoom(e2eRoomName);
        newE2eChatRoom.users = [$scope.currentUser, user];
        newE2eChatRoom.userNum = 2;
        newE2eChatRoom.roomImg = $scope.chatUsers[user].userPortrait;
        if ($scope.chatUsers[user].friendName == ''){
            newE2eChatRoom.roomNickName = $scope.chatUsers[user].userName;
        } else {
            newE2eChatRoom.roomNickName = $scope.chatUsers[user].friendName;
        }
        newE2eChatRoom.roomType = E2E_TYPE;
        $scope.chatRooms[e2eRoomName] = newE2eChatRoom;
        $scope.currentRoomName = e2eRoomName;
        $scope.chat_sfp_flag = 's';
        $scope.chat_room_user_info_tab = false;
    };

    $scope.chat_add_friend_tab_flag = 'r'; 

    $scope.chat_found_user = -1;

    $scope.chat_search_user_random = function(chat_same_city_only,chat_search_user_sex){
        if(!hascookie.check('cm')){
            return;
        }
        var data = {
            'userId':$scope.currentUser,
        };
        if (chat_same_city_only){
            var cityId = $scope.chatUsers[$scope.currentUser].cityId;
            data["cityId"] = cityId;
        } else {
            data["cityId"] = 0;
        }
        if (chat_search_user_sex == 1){
            data["gender"] = 1;
        } else if (chat_search_user_sex == 2){
            data["gender"] = 2;
        } else {
            data["gender"] = 5;
        }
        var url =IP_PORT + '/chat/match';
        $http.post(url, JSON.stringify(data));
        $scope.chat_found_user = '';
    };

    $scope.chat_search_user = function(user){
        if(!hascookie.check('cm')){
            return;
        }
        var url =SHOP_IP_PORT + '/userweb/search/' + user;
        $http.get(url).success(function(data, status, headers, config){
            if (data.users.length == 0){
                $scope.chat_found_user = '';
                return;
            }
            var userInfo = data.users[0];
            if ($scope.chatUsers.hasOwnProperty(userInfo.user_id)) {
                var findUser = $scope.chatUsers[userInfo.user_id];
            } else {
                var findUser = new ChatUser(userInfo.user_id);
            }
            findUser.userName = userInfo.name;
            findUser.userPortrait = userInfo.portrait_url[0];
            findUser.gender = userInfo.gender;
            findUser.mcode = userInfo.mcode;
            findUser.phoneNo = userInfo.phone_no;
            findUser.birthday = userInfo.birthday;
            findUser.cityId = userInfo.city_id;
            findUser.cityName = userInfo.city_name;

            $scope.chatUsers[userInfo.user_id] = findUser;
            $scope.chat_found_user = userInfo.user_id;
        }); 
    };
    $scope.chat_search_user('m'+currentUser);

    $scope.chat_room_tip_flag  = true;

    $scope.uploader = new FileUploader({
            url:'http://' + WS_IP_PORT+'/file/uploader',
            alias: 'file',
            headers: {
                //'Content-Type: ':'application/octet-stream'
            },
            queue: [],
            progress: 0,
            autoUpload: true,
            removeAfterUpload: false,
            method: 'POST',
            filters: [],
            formData: [
                //{key:'value'}
            ],
            queueLimit: Number.MAX_VALUE,
            withCredentials: false
        });

    $scope.uploader.onSuccessItem = function(item, response, status, headers) {
        console.log('response:' + JSON.stringify(response));
        sendMessage(response.url,response.content_type);
    };


    //$on
    //发送店面，商品 ,id:商品或者商店id, type:goods 商品，shop 商店 ,act 活动
    $scope.$on('sendObjChannel', function(evt, obj){
        var msgBody = {
            'user':currentUser,
            'time':0,
            'mtype':'mmx/' + obj.type,
            'm':{
                'id':obj.id,
                'name':obj.name,
                'img':obj.img
            }
        };

        send({
            'c':'CHAT_M',
            'gname':$scope.currentRoomName,
            'body':msgBody,
        });
        $scope.chat_sfp_flag = 's';
    });
    //私信店主
    $scope.$on('chatToOwnerChannel', function(evt, shopId){
        function callback(shopId){
            $scope.chat_invite_chat(shopId);
            $scope.chat_sfp_flag = 's';
        }
        $scope.chatUsers.getUserInfo(shopId, callback, shopId);
    });
    //进入聊天室
    var userEnterRoomReq = function (gname) {
        console.log('shopid is:'+gname);
        send({
            'c':'ENTR_SHOP',
            'user':currentUser,
            'gname':gname
        });
        $scope.currentRoomName = gname;
        addChatRoomListHead(gname);
        $scope.chat_sfp_flag = 's';
        setChatRoom(gname);

        var url =IP_PORT +'/chat/room/' + gname+'/users';
        $http.get(url).success(function(data, status, headers, config){
            console.log('get room users:'+JSON.stringify(data));
            $scope.chatRooms[gname].users = data.users;
            $scope.chatRooms[gname].userNum = data.total_num;

            for (var i = 0 ; i < data.users.length; i++) {
                $scope.chatUsers.getUserInfo(data.users[i], null, null);
            }
        });

        url =IP_PORT +'/chat/room/' + gname+'/info';
        $http.get(url).success(function(data, status, headers, config){
            console.log('get room info'+JSON.stringify(data));
            if (data.hasOwnProperty('eroor')) {
                return
            }
            $scope.chatRooms[gname].roomNickName = data.roomName;
            $scope.chatRooms[gname].roomImg = data.roomImg;
            $scope.chatRooms[gname].owner = data.owner;
        });
    };
    $scope.$on('enterShopChannel', function(evt, shopId){
        var gname = 'shop_' + shopId;
        userEnterRoomReq(gname);
        $scope.chatRooms[gname].roomType = SHOP_TYPE;
    });

    //$emit
    //发送店面商品
    $scope.clickObjMessage = function(id, type, name){
        type = type.slice(4,10);
        console.log('send type:'+type);
        $scope.$emit('recvObjChannel', {'id':id, 'type':type, 'name':name});
    }

    $scope.chat_delete_session =  function(r){
        var i = $scope.chatRoomList.indexOf(r);
        $scope.chatRoomList.splice(i,1);
    };
    $scope.chat_exit_room = function(r){
        var i = $scope.chatRoomList.indexOf(r);
        $scope.chatRoomList.splice(i,1);

        if (r.slice(0,3) == 'e2e'){
            return
        }

        send({
            'c':'EXIT_G',
            'user':currentUser,
            'gname':r
        });
    };

    $scope.people_emojis = [':bowtie:',
        ':smile:',':laughing:',':blush:',':smiley:',':relaxed:',
        ':smirk:',
            ':heart_eyes:',
            ':kissing_heart:',
            ':kissing_closed_eyes:',
            ':flushed:',
            ':relieved:',
            ':satisfied:',
            ':grin:',
            ':wink:',
            ':stuck_out_tongue_winking_eye:',
            ':stuck_out_tongue_closed_eyes:',
            ':grinning:',
            ':kissing:',
            ':kissing_smiling_eyes:',
            ':stuck_out_tongue:',
            ':sleeping:',
            ':worried:',
            ':frowning:',
            ':anguished:',
            ':open_mouth:',
            ':grimacing:',
            ':confused:',
            ':hushed:',
            ':expressionless:',
            ':unamused:',
            ':sweat_smile:',
            ':sweat:',
            ':disappointed_relieved:',
            ':weary:',
            ':pensive:',
            ':disappointed:',
            ':confounded:',
            ':fearful:',
            ':cold_sweat:',
            ':persevere:',
            ':cry:',
            ':sob:',
            ':joy:',
            ':astonished:',
            ':scream:',
            ':neckbeard:',
            ':tired_face:',
            ':angry:',
            ':rage:',
            ':triumph:',
            ':sleepy:',
            ':yum:',
            ':mask:',
            ':sunglasses:',
            ':dizzy_face:',
            ':imp:',
            ':smiling_imp:',
            ':neutral_face:',
            ':no_mouth:',
            ':innocent:',
                ':alien:',
                ':yellow_heart:',
                ':blue_heart:',
                ':purple_heart:',
                ':heart:',
                ':green_heart:',
                ':broken_heart:',
                ':heartbeat:',
                ':heartpulse:',
                ':two_hearts:',
                ':revolving_hearts:',
                ':cupid:',
                ':sparkling_heart:',
                ':sparkles:',
                ':star:',
                ':star2:',
                ':dizzy:',
                ':boom:',
                ':collision:',
                ':anger:',
                ':exclamation:',
                ':question:',
                ':grey_exclamation:',
                ':grey_question:',
                ':zzz:',
                ':dash:',
                ':sweat_drops:',
                ':notes:',
                ':musical_note:',
                ':fire:',
                ':hankey:',
                ':poop:',
                ':shit:',
                ':+1:',
                ':thumbsup:',
                ':-1:',
                ':thumbsdown:',
                ':ok_hand:',
                ':punch:',
                ':facepunch:',
                ':fist:',
                ':v:',
                ':wave:',
                ':hand:',
                ':raised_hand:',
                ':open_hands:',
                ':point_up:',
                ':point_down:',
                ':point_left:',
                ':point_right:',
                ':raised_hands:',
                ':pray:',
                ':point_up_2:',
                ':clap:',
                ':muscle:',
                ':metal:',
                ':fu:',
                ':runner:',
                ':running:',
                ':couple:',
                ':family:',
                ':two_men_holding_hands:',
                ':two_women_holding_hands:',
                ':dancer:',
                ':dancers:',
                ':ok_woman:',
                ':no_good:',
                ':information_desk_person:',
                ':raising_hand:',
                ':bride_with_veil:',
                ':person_with_pouting_face:',
                ':person_frowning:',
                ':bow:',
                ':couplekiss:',
                ':couple_with_heart:',
                ':massage:',
                ':haircut:',
                ':nail_care:',
                ':boy:',
                ':girl:',
                ':woman:',
                ':man:',
                ':baby:',
                ':older_woman:',
                ':older_man:',
                ':person_with_blond_hair:',
                ':man_with_gua_pi_mao:',
                ':man_with_turban:',
                ':construction_worker:',
                ':cop:',
                ':angel:',
                ':princess:',
                ':smiley_cat:',
                ':smile_cat:',
                ':heart_eyes_cat:',
                ':kissing_cat:',
                ':smirk_cat:',
                ':scream_cat:',
                ':crying_cat_face:',
                ':joy_cat:',
                ':pouting_cat:',
                ':japanese_ogre:',
                ':japanese_goblin:',
                ':see_no_evil:',
                ':hear_no_evil:',
                ':speak_no_evil:',
                ':guardsman:',
                ':skull:',
                ':feet:',
                ':lips:',
                ':kiss:',
                ':droplet:',
                ':ear:',
                ':eyes:',
                ':nose:',
                ':tongue:',
                ':love_letter:',
                ':bust_in_silhouette:',
                ':busts_in_silhouette:',
                ':speech_balloon:',
                ':thought_balloon:',
                ':feelsgood:',
                ':finnadie:',
                ':goberserk:',
                ':godmode:',
                ':hurtrealbad:',
                ':rage1:',
                ':rage2:',
                ':rage3:',
                ':rage4:',
                ':suspect:',
                ':trollface:'];
    $scope.nature_emojis = [':sunny:',':umbrella:',':cloud:',':snowflake:',':snowman:',
        ':zap:',
            ':cyclone:',
            ':foggy:',
            ':ocean:',
            ':cat:',
            ':dog:',
            ':mouse:',
            ':hamster:',
            ':rabbit:',
            ':wolf:',
            ':frog:',
            ':tiger:',
            ':koala:',
            ':bear:',
            ':pig:',
            ':pig_nose:',
            ':cow:',
            ':boar:',
            ':monkey_face:',
            ':monkey:',
            ':horse:',
            ':racehorse:',
            ':camel:',
            ':sheep:',
            ':elephant:',
            ':panda_face:',
            ':snake:',
            ':bird:',
            ':baby_chick:',
            ':hatched_chick:',
            ':hatching_chick:',
            ':chicken:',
            ':penguin:',
            ':turtle:',
            ':bug:',
            ':honeybee:',
            ':ant:',
            ':beetle:',
            ':snail:',
            ':octopus:',
            ':tropical_fish:',
            ':fish:',
            ':whale:',
            ':whale2:',
            ':dolphin:',
            ':cow2:',
            ':ram:',
            ':rat:',
            ':water_buffalo:',
            ':tiger2:',
            ':rabbit2:',
            ':dragon:',
            ':goat:',
            ':rooster:',
            ':dog2:',
            ':pig2:',
            ':mouse2:',
            ':ox:',
            ':dragon_face:',
            ':blowfish:',
            ':crocodile:',
            ':dromedary_camel:',
            ':leopard:',
            ':cat2:',
            ':poodle:',
            ':paw_prints:',
            ':bouquet:',
            ':cherry_blossom:',
            ':tulip:',
            ':four_leaf_clover:',
            ':rose:',
            ':sunflower:',
            ':hibiscus:',
            ':maple_leaf:',
            ':leaves:',
            ':fallen_leaf:',
            ':herb:',
            ':mushroom:',
            ':cactus:',
            ':palm_tree:',
            ':evergreen_tree:',
            ':deciduous_tree:',
            ':chestnut:',
            ':seedling:',
            ':blossom:',
            ':ear_of_rice:',
            ':shell:',
            ':globe_with_meridians:',
            ':sun_with_face:',
            ':full_moon_with_face:',
            ':new_moon_with_face:',
            ':new_moon:',
            ':waxing_crescent_moon:',
            ':first_quarter_moon:',
            ':waxing_gibbous_moon:',
            ':full_moon:',
            ':waning_gibbous_moon:',
            ':last_quarter_moon:',
            ':waning_crescent_moon:',
            ':last_quarter_moon_with_face:',
            ':first_quarter_moon_with_face:',
            ':earth_africa:',
            ':earth_americas:',
            ':earth_asia:',
            ':volcano:',
            ':milky_way:',
            ':partly_sunny:',
            ':octocat:',
            ':squirrel:'];
    $scope.objects_emojis = [':bamboo:',':gift_heart:',':dolls:',':school_satchel:',
        ':mortar_board:',':flags:',':fireworks:',
            ':sparkler:',
            ':wind_chime:',
            ':rice_scene:',
            ':jack_o_lantern:',
            ':ghost:',
            ':santa:',
            ':christmas_tree:',
            ':gift:',
            ':bell:',
            ':no_bell:',
            ':tanabata_tree:',
            ':tada:',
            ':confetti_ball:',
            ':balloon:',
            ':crystal_ball:',
            ':cd:',
            ':dvd:',
            ':floppy_disk:',
            ':camera:',
            ':video_camera:',
            ':movie_camera:',
            ':computer:',
            ':tv:',
            ':iphone:',
            ':phone:',
            ':telephone:',
            ':telephone_receiver:',
            ':pager:',
            ':fax:',
            ':minidisc:',
            ':vhs:',
            ':sound:',
            ':speaker:',
            ':mute:',
            ':loudspeaker:',
            ':mega:',
            ':hourglass:',
            ':hourglass_flowing_sand:',
            ':alarm_clock:',
            ':watch:',
            ':radio:',
            ':satellite:',
            ':loop:',
            ':mag:',
            ':mag_right:',
            ':unlock:',
            ':lock:',
            ':lock_with_ink_pen:',
            ':closed_lock_with_key:',
            ':key:',
            ':bulb:',
            ':flashlight:',
            ':high_brightness:',
            ':low_brightness:',
            ':electric_plug:',
            ':battery:',
            ':calling:',
            ':email:',
            ':mailbox:',
            ':postbox:',
            ':bath:',
            ':bathtub:',
            ':shower:',
            ':toilet:',
            ':wrench:',
            ':nut_and_bolt:',
            ':hammer:',
            ':seat:',
            ':moneybag:',
            ':yen:',
            ':dollar:',
            ':pound:',
            ':euro:',
            ':credit_card:',
            ':money_with_wings:',
            ':e-mail:',
            ':inbox_tray:',
            ':outbox_tray:',
            ':envelope:',
            ':incoming_envelope:',
            ':postal_horn:',
            ':mailbox_closed:',
            ':mailbox_with_mail:',
            ':mailbox_with_no_mail:',
            ':door:',
            ':smoking:',
            ':bomb:',
            ':gun:',
            ':hocho:',
            ':pill:',
            ':syringe:',
            ':page_facing_up:',
            ':page_with_curl:',
            ':bookmark_tabs:',
            ':bar_chart:',
            ':chart_with_upwards_trend:',
            ':chart_with_downwards_trend:',
            ':scroll:',
            ':clipboard:',
            ':calendar:',
            ':date:',
            ':card_index:',
            ':file_folder:',
            ':open_file_folder:',
            ':scissors:',
            ':pushpin:',
            ':paperclip:',
            ':black_nib:',
            ':pencil2:',
            ':straight_ruler:',
            ':triangular_ruler:',
            ':closed_book:',
            ':green_book:',
            ':blue_book:',
            ':orange_book:',
            ':notebook:',
            ':notebook_with_decorative_cover:',
            ':ledger:',
            ':books:',
            ':bookmark:',
            ':name_badge:',
            ':microscope:',
            ':telescope:',
            ':newspaper:',
            ':football:',
            ':basketball:',
            ':soccer:',
            ':baseball:',
            ':tennis:',
            ':8ball:',
            ':rugby_football:',
            ':bowling:',
            ':golf:',
            ':mountain_bicyclist:',
            ':bicyclist:',
            ':horse_racing:',
            ':snowboarder:',
            ':swimmer:',
            ':surfer:',
            ':ski:',
            ':spades:',
            ':hearts:',
            ':clubs:',
            ':diamonds:',
            ':gem:',
            ':ring:',
            ':trophy:',
            ':musical_score:',
            ':musical_keyboard:',
            ':violin:',
            ':space_invader:',
            ':video_game:',
            ':black_joker:',
            ':flower_playing_cards:',
            ':game_die:',
            ':dart:',
            ':mahjong:',
            ':clapper:',
            ':memo:',
            ':pencil:',
            ':book:',
            ':art:',
            ':microphone:',
            ':headphones:',
            ':trumpet:',
            ':saxophone:',
            ':guitar:',
            ':shoe:',
            ':sandal:',
            ':high_heel:',
            ':lipstick:',
            ':boot:',
            ':shirt:',
            ':tshirt:',
            ':necktie:',
            ':womans_clothes:',
            ':dress:',
            ':running_shirt_with_sash:',
            ':jeans:',
            ':kimono:',
            ':bikini:',
            ':ribbon:',
            ':tophat:',
            ':crown:',
            ':womans_hat:',
            ':mans_shoe:',
            ':closed_umbrella:',
            ':briefcase:',
            ':handbag:',
            ':pouch:',
            ':purse:',
            ':eyeglasses:',
            ':fishing_pole_and_fish:',
            ':coffee:',
            ':tea:',
            ':sake:',
            ':baby_bottle:',
            ':beer:',
            ':beers:',
            ':cocktail:',
            ':tropical_drink:',
            ':wine_glass:',
            ':fork_and_knife:',
            ':pizza:',
            ':hamburger:',
            ':fries:',
            ':poultry_leg:',
            ':meat_on_bone:',
            ':spaghetti:',
            ':curry:',
            ':fried_shrimp:',
            ':bento:',
            ':sushi:',
            ':fish_cake:',
            ':rice_ball:',
            ':rice_cracker:',
            ':rice:',
            ':ramen:',
            ':stew:',
            ':oden:',
            ':dango:',
            ':egg:',
            ':bread:',
            ':doughnut:',
            ':custard:',
            ':icecream:',
            ':ice_cream:',
            ':shaved_ice:',
            ':birthday:',
            ':cake:',
            ':cookie:',
            ':chocolate_bar:',
            ':candy:',
            ':lollipop:',
            ':honey_pot:',
            ':apple:',
            ':green_apple:',
            ':tangerine:',
            ':lemon:',
            ':cherries:',
            ':grapes:',
            ':watermelon:',
            ':strawberry:',
            ':peach:',
            ':melon:',
            ':banana:',
            ':pear:',
            ':pineapple:',
            ':sweet_potato:',
            ':eggplant:',
            ':tomato:',
            ':corn:'];
    $scope.places_emojis = [
            ':house:',
            ':house_with_garden:',
            ':school:',
            ':office:',
            ':post_office:',
            ':hospital:',
            ':bank:',
            ':convenience_store:',
            ':love_hotel:',
            ':hotel:',
            ':wedding:',
            ':church:',
            ':department_store:',
            ':european_post_office:',
            ':city_sunrise:',
            ':city_sunset:',
            ':japanese_castle:',
            ':european_castle:',
            ':tent:',
            ':factory:',
            ':tokyo_tower:',
            ':japan:',
            ':mount_fuji:',
            ':sunrise_over_mountains:',
            ':sunrise:',
            ':stars:',
            ':statue_of_liberty:',
            ':bridge_at_night:',
            ':carousel_horse:',
            ':rainbow:',
            ':ferris_wheel:',
            ':fountain:',
            ':roller_coaster:',
            ':ship:',
            ':speedboat:',
            ':boat:',
            ':sailboat:',
            ':rowboat:',
            ':anchor:',
            ':rocket:',
            ':airplane:',
            ':helicopter:',
            ':steam_locomotive:',
            ':tram:',
            ':mountain_railway:',
            ':bike:',
            ':aerial_tramway:',
            ':suspension_railway:',
            ':mountain_cableway:',
            ':tractor:',
            ':blue_car:',
            ':oncoming_automobile:',
            ':car:',
            ':red_car:',
            ':taxi:',
            ':oncoming_taxi:',
            ':articulated_lorry:',
            ':bus:',
            ':oncoming_bus:',
            ':rotating_light:',
            ':police_car:',
            ':oncoming_police_car:',
            ':fire_engine:',
            ':ambulance:',
            ':minibus:',
            ':truck:',
            ':train:',
            ':station:',
            ':train2:',
            ':bullettrain_front:',
            ':bullettrain_side:',
            ':light_rail:',
            ':monorail:',
            ':railway_car:',
            ':trolleybus:',
            ':ticket:',
            ':fuelpump:',
            ':vertical_traffic_light:',
            ':traffic_light:',
            ':warning:',
            ':construction:',
            ':beginner:',
            ':atm:',
            ':slot_machine:',
            ':busstop:',
            ':barber:',
            ':hotsprings:',
            ':checkered_flag:',
            ':crossed_flags:',
            ':izakaya_lantern:',
            ':moyai:',
            ':circus_tent:',
            ':performing_arts:',
            ':round_pushpin:',
            ':triangular_flag_on_post:',
            ':jp:',
            ':kr:',
            ':cn:',
            ':us:',
            ':fr:',
            ':es:',
            ':it:',
            ':ru:',
            ':gb:',
            ':uk:',
            ':de:'];
    $scope.symbols_emojis = [
        ':one:',
            ':two:',
            ':three:',
            ':four:',
            ':five:',
            ':six:',
            ':seven:',
            ':eight:',
            ':nine:',
            ':keycap_ten:',
            ':1234:',
            ':zero:',
            ':hash:',
            ':symbols:',
            ':arrow_backward:',
            ':arrow_down:',
            ':arrow_forward:',
            ':arrow_left:',
            ':capital_abcd:',
            ':abcd:',
            ':abc:',
            ':arrow_lower_left:',
            ':arrow_lower_right:',
            ':arrow_right:',
            ':arrow_up:',
            ':arrow_upper_left:',
            ':arrow_upper_right:',
            ':arrow_double_down:',
            ':arrow_double_up:',
            ':arrow_down_small:',
            ':arrow_heading_down:',
            ':arrow_heading_up:',
            ':leftwards_arrow_with_hook:',
            ':arrow_right_hook:',
            ':left_right_arrow:',
            ':arrow_up_down:',
            ':arrow_up_small:',
            ':arrows_clockwise:',
            ':arrows_counterclockwise:',
            ':rewind:',
            ':fast_forward:',
            ':information_source:',
            ':ok:',
            ':twisted_rightwards_arrows:',
            ':repeat:',
            ':repeat_one:',
            ':new:',
            ':top:',
            ':up:',
            ':cool:',
            ':free:',
            ':ng:',
            ':cinema:',
            ':koko:',
            ':signal_strength:',
            ':u5272:',
            ':u5408:',
            ':u55b6:',
            ':u6307:',
            ':u6708:',
            ':u6709:',
            ':u6e80:',
            ':u7121:',
            ':u7533:',
            ':u7a7a:',
            ':u7981:',
            ':sa:',
            ':restroom:',
            ':mens:',
            ':womens:',
            ':baby_symbol:',
            ':no_smoking:',
            ':parking:',
            ':wheelchair:',
            ':metro:',
            ':baggage_claim:',
            ':accept:',
            ':wc:',
            ':potable_water:',
            ':put_litter_in_its_place:',
            ':secret:',
            ':congratulations:',
            ':m:',
            ':passport_control:',
            ':left_luggage:',
            ':customs:',
            ':ideograph_advantage:',
            ':cl:',
            ':sos:',
            ':id:',
            ':no_entry_sign:',
            ':underage:',
            ':no_mobile_phones:',
            ':do_not_litter:',
            ':non-potable_water:',
            ':no_bicycles:',
            ':no_pedestrians:',
            ':children_crossing:',
            ':no_entry:',
            ':eight_spoked_asterisk:',
            ':eight_pointed_black_star:',
            ':heart_decoration:',
            ':vs:',
            ':vibration_mode:',
            ':mobile_phone_off:',
            ':chart:',
            ':currency_exchange:',
            ':aries:',
            ':taurus:',
            ':gemini:',
            ':cancer:',
            ':leo:',
            ':virgo:',
            ':libra:',
            ':scorpius:',
            ':sagittarius:',
            ':capricorn:',
            ':aquarius:',
            ':pisces:',
            ':ophiuchus:',
            ':six_pointed_star:',
            ':negative_squared_cross_mark:',
            ':a:',
            ':b:',
            ':ab:',
            ':o2:',
            ':diamond_shape_with_a_dot_inside:',
            ':recycle:',
            ':end:',
            ':on:',
            ':soon:',
            ':clock1:',
            ':clock130:',
            ':clock10:',
            ':clock1030:',
            ':clock11:',
            ':clock1130:',
            ':clock12:',
            ':clock1230:',
            ':clock2:',
            ':clock230:',
            ':clock3:',
            ':clock330:',
            ':clock4:',
            ':clock430:',
            ':clock5:',
            ':clock530:',
            ':clock6:',
            ':clock630:',
            ':clock7:',
            ':clock730:',
            ':clock8:',
            ':clock830:',
            ':clock9:',
            ':clock930:',
            ':heavy_dollar_sign:',
            ':copyright:',
            ':registered:',
            ':tm:',
            ':x:',
            ':heavy_exclamation_mark:',
            ':bangbang:',
            ':interrobang:',
            ':o:',
            ':heavy_multiplication_x:',
            ':heavy_plus_sign:',
            ':heavy_minus_sign:',
            ':heavy_division_sign:',
            ':white_flower:',
            ':100:',
            ':heavy_check_mark:',
            ':ballot_box_with_check:',
            ':radio_button:',
            ':link:',
            ':curly_loop:',
            ':wavy_dash:',
            ':part_alternation_mark:',
            ':trident:',
            ':white_check_mark:',
            ':black_square_button:',
            ':white_square_button:',
            ':black_circle:',
            ':white_circle:',
            ':red_circle:',
            ':large_blue_circle:',
            ':large_blue_diamond:',
            ':large_orange_diamond:',
            ':small_blue_diamond:',
            ':small_orange_diamond:',
            ':small_red_triangle:',
            ':small_red_triangle_down:',
            ':shipit:'];
    $scope.current_emojis = $scope.people_emojis;
    $scope.addEmoji = function(e){
        $scope.chatMessage += e;
    };
    }]);
});
