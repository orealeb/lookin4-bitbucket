angular.module('lookin4.controllers', [])
    .controller('LoginCtrl', function($scope, $ionicModal, GigAPI, $ionicPopup, $location, $rootScope) {

        $ionicModal.fromTemplateUrl('templates/login-modal.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.openModal = function() {
            $scope.modal.show()
        }

        $scope.closeModal = function() {
            $scope.modal.hide();
        };

        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        $scope.getAllFeed = function() {
        GigAPI.all(0).success(function(data, status, headers, config) {
            console.log(data);
            $scope.feed = data;
            $scope.$broadcast('scroll.refreshComplete');
        });
        }
        $scope.getAllFeed();


        if (openFB.getLoginStatus().status === 'connected') {
                console.log(openFB.getLoginStatus().status);
                $location.path('/app/search');
        }
        $scope.fbLogin = function() {
                    $scope.closeModal();
                    openFB.login(
                        function(response) {
                            if (response.status === 'connected') {
                                console.log(response);
                                console.log($scope);
                                    $scope.$apply(function() {
                                    $location.path('/app/search');
                                });
                            } else {
                                $scope.$apply(function() {
                                    $location.path('/login');
                                });
                            }
                        }, {
                            scope: 'email'
                        });
                if (openFB.getLoginStatus().status === 'connected') {
                    console.log(openFB.getLoginStatus().status);
                    $location.path('/app/search');
                }
            
        }
    })

.controller('MainCtrl', function($scope, $location, $rootScope, GigAPI, UserAPI) {
    $scope.hideNew = function() {
        return $location.path() === '/app/newgig'
    };
    $scope.isLoading = true;
    $scope.loading = function() {
        return $scope.isLoading
    };
    $scope.logout = function() {
        openFB.logout(function() {
            $location.path('/login');
        });

    }
    $scope.newgig = function() {
        $location.path('/app/newgig');
    }
})

.controller('FeedCtrl', function($scope, $ionicPopup, $ionicModal, PushWoosh, PushNotification, $rootScope, GigAPI, UserAPI,$location,cordovaGeolocationService) {
    
  

    $ionicModal.fromTemplateUrl('templates/gig-modal.html', {
        scope: $scope,
        animation: 'fade-in'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function() {
        $scope.modal.show()
    }

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    $scope.updateGigModal = function(gig)
    {
            $scope.gig = gig;
    }

    $scope.registerDeviceForNotification = function(userID) {
        console.log(userID);
        if (window.ionic.Platform.isAndroid()) {
            PushWoosh
                .registerPushwooshAndroid()
                .then(function(result) {
                    console.log(result);
                    $scope.updateProfile(userID, result);
                });
        }
        if (window.ionic.Platform.isIOS()) {
            PushWoosh
                .registerPushwooshIOS()
                .then(function(result) {
                    console.log(result.deviceToken);
                    $scope.updateProfile(userID, result.deviceToken);
                });
        }

        $scope.updateProfile = function(userID, deviceToken) {
            console.log(deviceToken);
            UserAPI.updateToken(userID, deviceToken)
                .success(function(data, status, headers, config) {
                    console.log("success");
                })
                .error(function(data, status, headers, config) {
                    console.log("token not updated");
                });
        }
    }

    $scope.check = false;
    $scope.userFlaggedReason = ' ';
    $scope.showCheck = function() {
        return $scope.check
    };
    $scope.interested = function(tID, gigOwnerID) {
        console.log("interested" + " " + tID + " " + gigOwnerID)
        UserAPI.get(gigOwnerID)
            .success(function(data, status, headers, config) {
                console.log($scope.user.name + " " + data.deviceToken + " " + data.name + " " + $scope.user.name);
                PushWoosh.notification($scope.user.name, data.deviceToken, data.name, $scope.user.name + " is interested in your gig!")
                    .success(function(data, status, headers, config) {
                        console.log("notification sent");
                    })
                    .error(function(data, status, headers, config) {
                       console.log(data);
                    });
            });
        GigAPI.interested($scope.user.userid, tID)
            .success(function(data, status, headers, config) {
                $scope.check = true;
                setTimeout(
                    function() {
                        $('#check').css('stroke-dashoffset', 0);
                    }, 1);
                $scope.getFeed();
                setTimeout(
                    function() {
                        $('#check').css('stroke-dashoffset', 130);
                        $scope.$apply(function() {
                            $scope.check = false;
                        });
                    }, 2000);
            })
    }
    $scope.notInterested = function(tID) {
        GigAPI.notInterested($scope.user.id, tID)
            .success(function(data, status, headers, config) {
                $scope.getLocationBasedFeed($scope.lat, $scope.longi);
            });
    }
    $scope.getDescription = function(description, tID, hidden, flagged) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Description',
            template: description,
            okText: 'Report' // String (default: 'OK'). The text of the OK button.
        });
        confirmPopup.then(function(res) {
            if (res) {
                $scope.flagGig(tID, hidden, flagged);
            }
        });
    }

    $scope.flagGig = function(tID, hidden, flagged) {
        $scope.data = {}

        var flagPopup = $ionicPopup.show({
            title: 'Flag and report Gig',
            template: '<input type="text" ng-model="data.userFlaggedReason">',
            subTitle: 'Please explain why',
            scope: $scope,
            buttons: [{
                text: 'Cancel'
            }, {
                text: '<b>Report</b>',
                type: 'button-positive',
                onTap: function(e) {

                    if (!$scope.data.userFlaggedReason) {
                        return ' ';
                    } else {
                        return $scope.data.userFlaggedReason;
                    }


                }
            }]
        });

        flagPopup.then(function(res) {
            if (typeof res === 'undefined')
                return;
            console.log(res);
            GigAPI.flagged(tID, hidden, flagged, "res")
                .success(function(data, status, headers, config) {
                    $scope.modal.hide(); 
                    var alertPopup = $ionicPopup.alert({
                        title: 'Gig reported'
                    });
                    $scope.notInterested(tID);

                })
                .error(function(data, status, headers, config) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Mistyped information'
                    });
                });

        });


    }

      if (openFB.getLoginStatus().status !== 'connected') {
            console.log(openFB.getLoginStatus().status);
            $location.path('/login');
        } else {
            openFB.api({
                path: '/me',
                success: function(user) {
                    UserAPI.new(user.id, user.name, user.email)
                        .success(function(data, headers, config, status) {
                            $scope.$parent.$parent.$parent.isLoading = false;
                            $scope.user = user;
                            UserAPI.get($scope.user.id).success(function(data, status, headers, config) {
                                 console.log("sssssssssss");
                                 $scope.user = data;
                                 $scope.$parent.$parent.$parent.user = data;
                                 console.log($scope.$parent.$parent.$parent.user);
                            })
                            $scope.getFeed();

                        })
                        .error(function(data, headers, config, status) {
                            $location.path('/login');
                        })
                },
                error: function() {
                    $location.path('/login');
                }
            });
        }



    $scope.getFeed = function() {
        if($scope.user.userid){
            UserAPI.get($scope.user.userid).success(function(data, status, headers, config) {
                console.log(data.deviceToken);
                $scope.registerDeviceForNotification($scope.user.userid);
            });
            GigAPI.all($scope.user.userid).success(function(data, status, headers, config) {
                console.log(data);
                $scope.feed = data;
                $scope.$broadcast('scroll.refreshComplete');
            });
        }
        else
        {                 
            UserAPI.get($scope.user.id).success(function(data, status, headers, config) {
                console.log(data.deviceToken);
                $scope.registerDeviceForNotification($scope.user.id);
            });   
            GigAPI.all($scope.user.id).success(function(data, status, headers, config) {
                console.log(data);
                $scope.feed = data;
                $scope.$broadcast('scroll.refreshComplete');
            });        
        }



    }

})

.controller('NewGigCtrl', function($scope, $location, $ionicPopup, GigAPI, cordovaGeolocationService) {
        var firstDay = new Date();
    $scope.currentNewGig = {
            date: firstDay,
            //lat: lat,
            //longi: longi,
            location: $scope.$parent.$parent.$parent.user.location
            //user current location
        }
        /**
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    cordovaGeolocationService
    .getCurrentPosition(function (position) {
      var lat  = position.coords.latitude;
      var longi = position.coords.longitude;
        //var nextWeek = new Date(firstDay.getTime() + 7 * 24 * 60 * 60 * 1000);
        $scope.currentNewGig = {
            date: firstDay,
            lat: lat,
            longi: longi
            //user current location
        }

    }, function(err) {
        $scope.currentNewGig = {
            date: firstDay,
            lat: 0,
            longi: 0
            //user current location
        }
      // error
    });**/


    $scope.postGig = function() {
        console.log($scope.currentNewGig);
        console.log($scope.$parent.$parent.$parent.user);
       /** if($scope.$parent.$parent.$parent.user.lat && $scope.$parent.$parent.$parent.user.longi){
        GigAPI.new($scope.$parent.$parent.$parent.user.userid, $scope.$parent.$parent.$parent.user.name, $scope.currentNewGig.date, 
                    $scope.currentNewGig.position, $scope.currentNewGig.rate, $scope.currentNewGig.description, $scope.$parent.$parent.$parent.user.lat, $scope.$parent.$parent.$parent.user.longi, $scope.currentNewGig.location) //location
            .success(function(data, status, headers, config) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Your gig has been posted'
                });
                alertPopup.then();
                $location.path('/app/search');
            })
            .error(function(data, status, headers, config) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Not enough parameters'
                });
                alertPopup.then();
            });
    }**/
    //else
    //{
         GigAPI.new($scope.$parent.$parent.$parent.user.userid, $scope.$parent.$parent.$parent.user.name, $scope.currentNewGig.date, 
                    $scope.currentNewGig.position, $scope.currentNewGig.rate, $scope.currentNewGig.description, 0, 0, $scope.currentNewGig.location) //location
            .success(function(data, status, headers, config) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Your gig has been posted'
                });
                alertPopup.then();
                $location.path('/app/search');
            })
            .error(function(data, status, headers, config) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Not enough parameters'
                });
                alertPopup.then();
            });
    //}

    }

})

.controller('ProfileCtrl', function($scope, $ionicPopup, UserAPI) {
    $scope.user = $scope.$parent.user;
    if (!$scope.user.caption) {
        $scope.user.caption = "";
    }
    if (!$scope.user.phone) {
        $scope.user.phone = "";
    }
    if (!$scope.user.location) {
        $scope.user.location = "";
    }
    $scope.updateProfile = function() {
        //$scope.user.location = "";
        console.log($scope.user);
        UserAPI.update($scope.user.userid, $scope.user.phone, $scope.user.caption, $scope.user.location)
            .success(function(data, status, headers, config) {      
                var alertPopup = $ionicPopup.alert({
                    title: 'Your profile has been updated'
                });
                alertPopup.then();
            })
            .error(function(data, status, headers, config) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Mistyped information'
                });
                alertPopup.then();
            });

    }
})

.controller('MyGigsCtrl', function($scope, $ionicPopup, $location, GigAPI) {
    $scope.getPersonal = function() {
        GigAPI.personal($scope.$parent.$parent.$parent.user.userid)
            .success(function(data, headers, config, status) {
                $scope.personal = data;
                $scope.$broadcast('scroll.refreshComplete');
            })
    }
    $scope.findInterested = function(id, len) {
        if (len > 0) {
            $location.path("/app/interested").search("id", id);
        }
    }
    $scope.deleteGig = function(id){
        console.log("dd");
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Gig',
            template: 'Are you sure you want to delete your Gig?'
        });
        confirmPopup.then(function(res) {
            if (res) {
                GigAPI.flagged(id, true, 5000, "res");
                $scope.getPersonal();
            }
        });
    }
    $scope.getPersonal();
})


.controller('MyInterestedGigsCtrl', function($scope, $q, $ionicPopup, MessageAPI, ChatRoomAPI, UserAPI, $ionicModal, $location, GigAPI){
    
    $ionicModal.fromTemplateUrl('templates/gig-modal.html', {
        scope: $scope,
        animation: 'fade-in'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.pageLocation = "myinterests";
    $scope.openModal = function() {
        $scope.modal.show()
    }

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    $scope.updateGigModal = function(gig)
    {
            $scope.gig = gig;
            $scope.openModal();
    }

    $scope.getMyInterests = function() {
          

          GigAPI.getMyInterests($scope.$parent.$parent.$parent.user.userid)
            .success(function(data, headers, config, status) {
                $scope.interests = data;

                var promises = [];
                var messagesNotSeen = [{}];

                angular.forEach($scope.interests, function(user) {    
                    promises.push(MessageAPI.getNotSeenMessages(ChatRoomAPI.createID($scope.$parent.$parent.$parent.user.userid, user.userid), $scope.$parent.$parent.$parent.user.userid)
                    .then(function(res, status, headers, config){ 
                        messagesNotSeen[user.userid] = res.data.length > 0 ? 1 : 0;
                        console.log(user.userid);
                    }));
                });
                $q.all(promises).then(function(){

                console.log(messagesNotSeen);
                $scope.messagesNotSeen = messagesNotSeen;
                $scope.$broadcast('scroll.refreshComplete');

                });

            })

    }

    $scope.getDescription = function(description, tID, hidden, flagged) {
        var alertPopup = $ionicPopup.alert({
            title: 'Description',
            template: description
        });
    }

    $scope.showMessages = function(toUserid){
    $location.path("/app/usermessages").search("id", [$scope.id, toUserid]); 
    }
    $scope.getMyInterests();
})

.controller('InterestedCtrl', function($scope, $q, ChatRoomAPI, MessageAPI, UserAPI, $ionicModal, $location, GigAPI) {

    $scope.id = $location.search()["id"];
    if (!$scope.id) {
        $location.path("/app/gigs");
    }

    $ionicModal.fromTemplateUrl('templates/profile-modal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function() {
        $scope.modal.show()
    }

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    $scope.updateUserModal = function(toUserId)
    {
         UserAPI.get(toUserId)
            .success(function(data, headers, config, status) {
                $scope.toUser = data;
                console.log($scope.toUser);
                $scope.openModal();
            })
    }

    $scope.getInterested = function() {
        GigAPI.getInterested($scope.id)
            .success(function(data, headers, config, status) {
                $scope.interested = data;
                var promises = [];
                var messagesNotSeen = [{}];

                angular.forEach($scope.interested, function(user) {    
                    promises.push(MessageAPI.getNotSeenMessages(ChatRoomAPI.createID($scope.$parent.$parent.$parent.user.userid, user.userid), $scope.$parent.$parent.$parent.user.userid)
                    .then(function(res, status, headers, config){ 
                        messagesNotSeen[user.userid] = res.data.length > 0 ? 1 : 0;
                        console.log(res);
                    }));
                });
                $q.all(promises).then(function(){

                console.log(messagesNotSeen);
                $scope.messagesNotSeen = messagesNotSeen;
                $scope.$broadcast('scroll.refreshComplete');

                });

            })
    }
    $scope.showMessages = function(toUserid){
    $location.path("/app/usermessages").search("id", [$scope.id, toUserid]); 
    }
    $scope.getInterested();

})


.controller('UserMessagesCtrl', 
  function($scope, $rootScope, $state, $location, $stateParams,
    $ionicActionSheet,
    $ionicPopup, $ionicScrollDelegate, $timeout, $interval, UserAPI, MessageAPI, ChatRoomAPI, PushWoosh, PushNotification) { //console.log($location);


      $scope.id = $location.search()["id"];
      if (!$scope.id){
        $location.path("/app/gigs");
      }

      var toUserId = $scope.id[1];
      var fromUserId = $scope.$parent.$parent.$parent.user.userid;
      $scope.toUser  = '';
      $scope.user = '';
      //try to find if chatroom already exist, if it doesn't then create new one->>
      $scope.getChatRoom = function(id1, id2)
      {         

          ChatRoomAPI.get($scope.chatRoomID)
          .success(function(data, headers, config, status){
              $scope.beginChatting();

            }).error(function(data, status, headers, config){
          ChatRoomAPI.new($scope.chatRoomID, fromUserId, toUserId, $scope.user.username, $scope.toUser.username)
          .success(function(data, status, headers, config){
              $scope.beginChatting();
          })
          })
      }

  


      $scope.getUsers = function(toUserId, fromUserId){
       UserAPI.get(toUserId)
            .success(function(data, headers, config, status) {
                var toUser = data;
                console.log(toUser);
                $scope.toUser = {
                _id: toUser.userid,
                deviceToken: toUser.deviceToken,
                pic: "http://graph.facebook.com/" + toUser.userid + "/picture?width=270&height=270", 
                username: toUser.name //change later
                }
            })
       UserAPI.get(fromUserId)
        .success(function(data, headers, config, status) {
                var fromUser = data;
                console.log(fromUser);
                $scope.user = {
                _id: fromUser.userid,
                pic: "http://graph.facebook.com/" + fromUser.userid + "/picture?width=270&height=270", 
                username: fromUser.name
                };
            })
      }

      $scope.getUsers(toUserId, fromUserId);
      $scope.chatRoomID = ChatRoomAPI.createID(toUserId, fromUserId);
      $scope.getChatRoom(toUserId, fromUserId);

      console.log($scope.chatRoomID);


    $scope.beginChatting = function()
    {
      console.log("begin chatting");
        $scope.input = { message: localStorage['userMessage-' + $scope.toUser._id] || '' };

    var messageCheckTimer;

    var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
    var footerBar; // gets set in $ionicView.enter
    var scroller;
    var txtInput; // ^^^

      getOldMessages();
        footerBar = document.body.querySelector('#userMessagesView .bar-footer');
        scroller = document.body.querySelector('#userMessagesView .scroll-content');
        txtInput = angular.element(footerBar.querySelector('textarea'));

    $scope.$on('$ionicView.enter', function() {
      console.log('UserMessages $ionicView.enter');

      
      $timeout(function() {
        footerBar = document.body.querySelector('#userMessagesView .bar-footer');
        scroller = document.body.querySelector('#userMessagesView .scroll-content');
        txtInput = angular.element(footerBar.querySelector('textarea'));
      }, 0);

      messageCheckTimer = $interval(function() {

     MessageAPI.getNotSeenMessages($scope.chatRoomID, fromUserId).then(function(res) {
        for (var i = 0; i < res.data.length; i++) {
          $scope.messages.push(res.data[i]);
          MessageAPI.setSeenMessage(res.data[i]._id);
          keepKeyboardOpen();
         viewScroll.scrollBottom(true);
        };
      });

        // here you could check for new messages if your app doesn't use push notifications or user disabled them
      }, 1000);
    });

    $scope.$on('$ionicView.leave', function() {
      console.log('leaving UserMessages view, destroying interval');
      // Make sure that the interval is destroyed
      if (angular.isDefined(messageCheckTimer)) {
        $interval.cancel(messageCheckTimer);
        messageCheckTimer = undefined;
      }
    });

    $scope.$on('$ionicView.beforeLeave', function() {
      if (!$scope.input.message || $scope.input.message === '') {
        localStorage.removeItem('userMessage-' + $scope.toUser._id);
      }
    });

    function getOldMessages() {

    

     MessageAPI.all($scope.chatRoomID).then(function(res) {
        $scope.messages = [{}];
        for (var i = 0; i < res.data.length; i++) {
            console.log(res.data[i]);
          $scope.messages.push(res.data[i]);
          MessageAPI.setSeenMessage(res.data[i]._id);
            
        };

        $scope.doneLoading = true;

        console.log(res.data);
        $timeout(function() {
          viewScroll.scrollBottom();
        }, 0);
      });
    }

    $scope.$watch('input.message', function(newValue, oldValue) {
      console.log('input.message $watch, newValue ' + newValue);
      if (!newValue) newValue = '';
      localStorage['userMessage-' + $scope.toUser._id] = newValue;
    });

    $scope.sendMessage = function(sendMessageForm) {
      //var message = {
        //toId: $scope.toUser._id,
       // text: $scope.input.message
     // };

      var message = {};
      message.text = $scope.input.message;
      // if you do a web service call this will be needed as well as before the viewScroll calls
      // you can't see the effect of this in the browser it needs to be used on a real device
      // for some reason the one time blur event is not firing in the browser but does on devices
      keepKeyboardOpen();
      
      $scope.input.message = '';

      message.date = new Date();
      message.userid = $scope.user._id;

      $timeout(function() {
        keepKeyboardOpen();
        viewScroll.scrollBottom(true);
      }, 0);


      $timeout(function() {
       
      MessageAPI.new($scope.chatRoomID, message.userid , message.date, message.text).then(function(data) {
          $scope.messages.push(message);
          keepKeyboardOpen();
        viewScroll.scrollBottom(true);

        PushWoosh.notificationAndroid($scope.user.username, $scope.toUser.deviceToken, $scope.toUser.username , $scope.user.username + ": " + message.text)
        .success(function(data, status, headers, config) {
            console.log("notification sent");
        })
        .error(function(data, status, headers, config) {
            console.log(data);
        });
     PushWoosh.notificationIOS($scope.user.username, $scope.toUser.deviceToken, $scope.toUser.username , $scope.user.username + ": " + message.text)
        .success(function(data, status, headers, config) {
            console.log("notification sent");
        })
        .error(function(data, status, headers, config) {
            console.log(data);
        });
      })

      //send push notification to other guy
     


      }, 1000);
    };
    
    // this keeps the keyboard open on a device only after sending a message, it is non obtrusive
    function keepKeyboardOpen() {
      console.log('keepKeyboardOpen');
      txtInput.one('blur', function() {
        console.log('textarea blur, focus back on it');
        txtInput[0].focus();
      });
    }

    $scope.onMessageHold = function(e, itemIndex, message) {
      console.log('onMessageHold');
      console.log('message: ' + JSON.stringify(message, null, 2));
      $ionicActionSheet.show({
        buttons: [{
          text: 'Copy Text'
        }//, {
         // text: 'Delete Message'
        //}
        ],
        buttonClicked: function(index) {
          switch (index) {
            case 0: // Copy Text
              cordova.plugins.clipboard.copy(message.text);

              break;
            //case 1: // Delete
              // no server side secrets here :~)
              //$scope.messages.splice(itemIndex, 1);
              //$timeout(function() {
              //  viewScroll.resize();
             // }, 0);

             // break;
          }
          
          return true;
        }
      });
    };

    // this prob seems weird here but I have reasons for this in my app, secret!
    $scope.viewProfile = function(msg) {
      if (msg.userId === $scope.user._id) {
        // go to your profile
      } else {
        // go to other users profile
      }
    };
    
    // I emit this event from the monospaced.elastic directive, read line 480
    $scope.$on('taResize', function(e, ta) {
      console.log('taResize');
      if (!ta) return;
      
      var taHeight = ta[0].offsetHeight;
      console.log('taHeight: ' + taHeight);
      
      if (!footerBar) return;
      
      var newFooterHeight = taHeight + 10;
      newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;
      
      footerBar.style.height = newFooterHeight + 'px';
      scroller.style.bottom = newFooterHeight + 'px'; 
    });
  }

});