angular.module('lookin4.factory', [])
 .factory('PushWoosh', function($q, $http) {
        return {
            registerPushwooshAndroid: function() {
                var deferred = $q.defer();
                var pushNotification = window.plugins.pushNotification;

                //set push notifications handler
                document.addEventListener('push-notification',
                    function(event) {
                        var title = event.notification.title;
                        var message = event.notification.message;
                        var userData = event.notification.userdata;

                        if (typeof(userData) != "undefined") {
                            console.warn('user data: ' + JSON.stringify(userData));
                        }
                    }
                );

                //initialize Pushwoosh with projectid: "GOOGLE_PROJECT_ID", appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
                pushNotification.onDeviceReady({
                    projectid: "922706522961",
                    appid: "F12FB-0776D"
                });

                //register for push notifications
                pushNotification.registerDevice(deferred.resolve, deferred.reject);
                return deferred.promise;
            },

            registerPushwooshIOS: function() {
                var deferred = $q.defer();
                var pushNotification = window.plugins.pushNotification;

                //set push notification callback before we initialize the plugin
                document.addEventListener('push-notification',
                    function(event) {
                        //get the notification payload
                        var notification = event.notification;
                        //display alert to the user for example
                        alert(notification.aps.alert);
                        pushNotification.setApplicationIconBadgeNumber(0);
                    }
                );
                //initialize the plugin
                pushNotification.onDeviceReady({
                    pw_appid: "F12FB-0776D"
                });

                //register for pushes
                pushNotification.registerDevice(deferred.resolve, deferred.reject);

                //reset badges on start
                pushNotification.setApplicationIconBadgeNumber(0);
                return deferred.promise;
            },

           /** notification: function(fromUserName, deviceToken, toUserName, content) {
                console.log("notification about to be sent");
                data = {
                    "request": {
                        "application": "40B1F-4CF99",
                        "auth": "s3rLdY7akQlrSHKJnvCAI6LXJZJPRf5LbbKXw4HFSy3cx0aDvMcd0eOMUHJZaPQQgoxAA6txiylVhRuTWV3S",
                        "notifications": [{
                            "send_date": "now",
                            "ignore_user_timezone": true,
                            "content": {
                                "en": content
                            },
                            "link": "",
                            "data": {

                            },
                            "platforms": [1,3],
                            "android_root_params": {
                                "key": "value"
                            },
                            "android_icon": "icon",
                            "android_vibration": 1,
                            "android_led": "#4a86e8",
                            "android_custom_icon": "https://raw.githubusercontent.com/orealeb/Table-stylesheet/master/icon.png",
                            "android_banner": "https://raw.githubusercontent.com/orealeb/Table-stylesheet/master/icon.png",       

                            "devices": [deviceToken]
                        }]
                    }
                };
                return $http({
                    url: "https://cp.pushwoosh.com/json/1.3/createMessage",
                    method: "POST",
                    data: data
                })
            }**/

            notificationAndroid: function(fromUserName, deviceToken, toUserName, content) {
                console.log("notification about to be sent");
                data = {
                    "request": {
                        "application": "F12FB-0776D",
                        "auth": "xxLCbBfELvVlAgIlbTkUEEgNneINHZW6UAYeh9ObmCK66UXiSagvUVwf18aUVBPShBIHLUxjAzQC4xsRnA4r",
                        "notifications": [{
                            "send_date": "now",
                            "ignore_user_timezone": true,
                            "content": {
                                "en": content
                            },
                            "link": "",
                            "data": {

                            },
                            "platforms": [3],
                            "android_root_params": {
                                "key": "value"
                            },
                            "android_icon": "icon",
                            "android_vibration": 1,
                            "android_led": "#4a86e8",
                            "android_custom_icon": "https://raw.githubusercontent.com/orealeb/Table-stylesheet/master/icon.png",
                            "android_banner": "https://raw.githubusercontent.com/orealeb/Table-stylesheet/master/icon.png",       

                            "devices": [deviceToken]
                        }]
                    }
                };
                return $http({
                    url: "https://cp.pushwoosh.com/json/1.3/createMessage",
                    method: "POST",
                    data: data
                })
            },
                notificationIOS: function(fromUserName, deviceToken, toUserName, content) {
                console.log("notification about to be sent");
                data = {
                    "request": {
                        "application": "F12FB-0776D",
                        "auth": "xxLCbBfELvVlAgIlbTkUEEgNneINHZW6UAYeh9ObmCK66UXiSagvUVwf18aUVBPShBIHLUxjAzQC4xsRnA4r",
                        "notifications": [{
                            "send_date": "now",
                            "ignore_user_timezone": true,
                            "content": {
                                "en": content
                            },
                            "platforms": [1],
                            "ios_category_id": "1",
                            "devices": [deviceToken]
                        }]
                    }
                };
                return $http({
                    url: "https://cp.pushwoosh.com/json/1.3/createMessage",
                    method: "POST",
                    data: data
                })
            }


        }
    })
/*
*   author: domenjeric
*   github: https://github.com/domenjeric   
*/
.factory('PushNotification', function($ionicPlatform, $q, $http) {
    var ionicReady = $q.defer();

    $ionicPlatform.ready(function(device) {
        ionicReady.resolve(device);
    });


    var pushObj = {
        //register device for push notifications
        registerDevice: function() {
            var deferred = $q.defer();
            ionicReady.promise.then(function(device) {
                //Insert your google project number and pushapps token:
                PushNotification.registerDevice("177415494043", "1c11d12d-ba22-4b6e-a885-ebbb6ce67390", function(pushToken) {
                    deferred.resolve(pushToken);
                }, function(error) {
                    deferred.reject(error);
                });
            });
            return deferred.promise;
        },

        //unregister device
        unRegisterDevice: function() {
            var deferred = $q.defer();
            ionicReady.promise.then(function(device) {
                PushNotification.unRegisterDevice(function() {
                    deferred.resolve();
                }, function(error) {
                    deferred.reject(error);
                });
            });
            return deferred.promise;
        },


        //get PushApps Device id - read more at https://wiki.pushapps.mobi/pages/viewpage.action?pageId=2785298
        getDeviceId: function() {
            var deferred = $q.defer();
            ionicReady.promise.then(function(device) {
                PushNotification.getDeviceId(function(deviceId) {
                        deferred.resolve(deviceId);
                    },
                    function(error) {
                        deferred.reject(error);
                    });
            });
            return deferred.promise;
        },

        //set tags - read more at https://wiki.pushapps.mobi/pages/viewpage.action?pageId=2785298
        setTags: function(iden, value) {
            var deferred = $q.defer();
            ionicReady.promise.then(function(device) {
                PushNotification.setTags([{
                    identifier: iden,
                    value: value
                }], function() {
                    deferred.resolve();
                }, function(error) {
                    deferred.reject(error);
                });
            });
            return deferred.promise;
        },
        
        //remove tags - read more at https://wiki.pushapps.mobi/pages/viewpage.action?pageId=2785298
        removeTags: function(idens) {
            var deferred = $q.defer();
            ionicReady.promise.then(function(device) {
                PushNotification.removeTags(idens, function() {
                    deferred.resolve;
                }, function(error) {
                    deferred.reject(error);
                });
            });
            return deferred.promise;
        },

            //send push 
    notification:function(fromUserName, deviceID, toUserName, content) {
            console.log("notification about to be sent");
            data = {
                    "SecretToken": "095d7d6c-9731-4d34-a7b2-0c3eeb04f83c",
                    "Message": content,
                    "DeviceIds": [
                        deviceID
                    ]
                };
                return $http({
                    url: "https://ws.pushapps.mobi/RemoteAPI/CreateNotification",
                    method: "POST",
                    data: data
                })
        }
    }




    return pushObj;

})

.factory('GigAPI', function($http, $q, cordovaGeolocationService) {
    var base = "http://lookin4.herokuapp.com/api/gigs"
    return {
        all: function(userID) {
            return $http({
                url: base + "/feed",
                method: "POST",
                data: {
                    userID: userID
                }
            })
        },
        allBasedOnLocation: function(userID, lat, longi, callback) {
              //var r = $.Deferred();
             Number.prototype.toRad = function() {
               return this * Math.PI / 180;
            }
            getMiles = function (lat1, long1, lat2, long2){



               // long1 = -71.02; lat1 = 42.33;
               // long2 = -73.94; lat2 = 40.66;
                        console.log(lat1 + " " + long1 +  " " + lat2 +" " + long2);

               var R = 6371; // km 
                //has a problem with the .toRad() method below.
                var x1 = lat2-lat1;
                var dLat = x1.toRad();  
                var x2 = long2-long1;
                var dLon = x2.toRad();  
                var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                                Math.cos((lat1*Math.PI / 180)) * Math.cos((lat2*Math.PI / 180)) * 
                                Math.sin(dLon/2) * Math.sin(dLon/2);  
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                var d = R * c; 
                                console.log("ssuccessssuccessssuccessssuccess" + d + " " + R + " " + c + " " + a + " " + 2 * Math.atan2( Math.sqrt(a), Math.sqrt(1-a)) + " " + Math.sqrt(a) + " "  + Math.sqrt(1-a));
                return Math.round( d * 100) / 100;
            }

            //return
            var promises = [];
            var gigWithMiles = [{}]; 
            $http({
                url: base + "/feed",
                method: "POST",
                data: {
                    userID: userID
                }
            }).success(function(data, status, headers, config) {
                console.log(data);

                 cordovaGeolocationService
                            .getCurrentPosition(function (position) {
                              var currLati  = position.coords.latitude;
                              var currLongi = position.coords.longitude;
                              console.log(currLati + " " + currLongi);

                angular.forEach(data, function(gig) {   

                        /**if(!gig.miles)
                        {
                            var geocoder = new google.maps.Geocoder();
                            var address = gig.miles;
                            geocoder.geocode( { 'address': address}, function(results, status) {
                              if (status == google.maps.GeocoderStatus.OK)
                              {

                                  // do something with the geocoded result
                                  //
                                  // results[0].geometry.location.latitude
                                  // results[0].geometry.location.longitude
                              }
                            });
                        } **/
                    //promises.push(getMiles(currLati, currLongi, gig.lati, gig.longi)
                    //.then(function(res, status, headers, config){ 
                        gigWithMiles.push({_id: gig._id, userid: gig.userid, name: gig.name, position: gig.position,
                        rate: gig.rate, date: gig.date, description: gig.description, flagged: gig.flagged,
                        interested: gig.interested, flaggedReason: gig.flaggedReason, hidden: gig.hidden,
                        lat: gig.lat, longi: gig.longi, miles: getMiles(currLati, currLongi, gig.lat, gig.longi), location: gig.location});   //new gig propety);
                        console.log(gig._id + " " + gig.lat + " " + gig.longi);
                   // }));
                });

               // $q.all(promises).then(function(){
               // console.log("ssuccessssuccessssuccessssuccess2222222222");
                //r.resolve(gigWithMiles);
                gigWithMiles.shift();
                console.log(gigWithMiles);
                callback(gigWithMiles.sort(function(a,b) { return parseFloat(b.miles) - parseFloat(a.miles) }) );//

               //});

                            });

                //foreach gig get, lat, longi..then calculate and add miles property, then sort

       
            })
            .error(function(data, status, headers, config) {            
                return $http({
                url: base + "/feed",
                method: "POST",
                data: {
                    userID: userID
                }
                })
            });
           // }

        },
        allTimeSorted: function(userID, callback) {
            $http({
                url: base + "/feed",
                method: "POST",
                data: {
                    userID: userID
                }
             }).success(function(data, status, headers, config) {
                arr = [];
                angular.forEach(data, function(gig) {   
                        arr.push({_id: gig._id, userid: gig.userid, name: gig.name, position: gig.position,
                        rate: gig.rate, date: gig.date, description: gig.description, flagged: gig.flagged,
                        interested: gig.interested, flaggedReason: gig.flaggedReason, hidden: gig.hidden, 
                        location: gig.location
                        });   
                });
                console.log(data);
                console.log(arr);
                callback(arr.sort(function(a,b) { return (new Date(a.date) - new Date(b.date)) }) );//
            })
            .error(function(data, status, headers, config) {            
                return $http({
                url: base + "/feed",
                method: "POST",
                data: {
                    userID: userID
                }
                })
            });
        },
        allRateSorted: function(userID, callback) {
            $http({
                url: base + "/feed",
                method: "POST",
                data: {
                    userID: userID
                }
             }).success(function(data, status, headers, config) {
                arr = [];
                angular.forEach(data, function(gig) {   
                        arr.push({_id: gig._id, userid: gig.userid, name: gig.name, position: gig.position,
                        rate: gig.rate, date: gig.date, description: gig.description, flagged: gig.flagged,
                        interested: gig.interested, flaggedReason: gig.flaggedReason, hidden: gig.hidden,
                        location: gig.location
                        });   
                });
                console.log(data);
                console.log(arr);
                callback(arr.sort(function(a,b) { return parseFloat(a.rate) - parseFloat(b.rate) }) );//
            })
            .error(function(data, status, headers, config) {            
                return $http({
                url: base + "/feed",
                method: "POST",
                data: {
                    userID: userID
                }
                })
            });
        },
        allNameSorted: function(userID, callback) {
            $http({
                url: base + "/feed",
                method: "POST",
                data: {
                    userID: userID
                }
             }).success(function(data, status, headers, config) {
                arr = [];
                angular.forEach(data, function(gig) {   
                        arr.push({_id: gig._id, userid: gig.userid, name: gig.name, position: gig.position,
                        rate: gig.rate, date: gig.date, description: gig.description, flagged: gig.flagged,
                        interested: gig.interested, flaggedReason: gig.flaggedReason, hidden: gig.hidden,
                        location: gig.location
                        });   
                });
                console.log(data);
                console.log(arr);
                callback(
                arr.sort(function(a, b){
                    if(a.position < b.position) return 1;
                    if(a.position > b.position) return -1;
                    return 0;
                }) );//
            })
            .error(function(data, status, headers, config) {            
                return $http({
                url: base + "/feed",
                method: "POST",
                data: {
                    userID: userID
                }
                })
            });
        },
        allRequesterSorted: function(userID, callback) {
            $http({
                url: base + "/feed",
                method: "POST",
                data: {
                    userID: userID
                }
             }).success(function(data, status, headers, config) {
                arr = [];
                angular.forEach(data, function(gig) {   
                        arr.push({_id: gig._id, userid: gig.userid, name: gig.name, position: gig.position,
                        rate: gig.rate, date: gig.date, description: gig.description, flagged: gig.flagged,
                        interested: gig.interested, flaggedReason: gig.flaggedReason, hidden: gig.hidden,
                        location: gig.location
                        });   
                });
                console.log(data);
                console.log(arr);
                callback(
                arr.sort(function(a, b){
                    if(a.name < b.name) return 1;
                    if(a.name > b.name) return -1;
                    return 0;
                }) );//
            })
            .error(function(data, status, headers, config) {            
                return $http({
                url: base + "/feed",
                method: "POST",
                data: {
                    userID: userID
                }
                })
            });
        },
        allLocationSorted: function(userID, callback) {
            $http({
                url: base + "/feed",
                method: "POST",
                data: {
                    userID: userID
                }
             }).success(function(data, status, headers, config) {
                arr = [];
                angular.forEach(data, function(gig) {   
                        arr.push({_id: gig._id, userid: gig.userid, name: gig.name, position: gig.position,
                        rate: gig.rate, date: gig.date, description: gig.description, flagged: gig.flagged,
                        interested: gig.interested, flaggedReason: gig.flaggedReason, hidden: gig.hidden,
                        location: gig.location
                        });   
                });
                console.log(data);
                console.log(arr);
                callback(
                arr.sort(function(a, b){
                    if(a.location < b.location) return 1;
                    if(a.location > b.location) return -1;
                    return 0;
                }) );//
            })
            .error(function(data, status, headers, config) {            
                return $http({
                url: base + "/feed",
                method: "POST",
                data: {
                    userID: userID
                }
                })
            });
        },
        allfeed: function(userID) {
            return $http({
                url: base + "/allfeed",
                method: "POST",
                data: {
                    userID: userID
                }
            })
        },
        personal: function(userID) {
            return $http({
                url: base + "/personal",
                method: "POST",
                data: {
                    userID: userID
                }
            })
        },
        new: function(userid, name, date, position, rate, description, lat, longi, location) {
            return $http({
                url: base + "/new",
                method: "POST",
                data: {
                    userID: userid,
                    name: name,
                    date: date,
                    position: position,
                    rate: rate,
                    description: description,
                    lat: lat,
                    longi: longi,
                    location: location
                },
            })
        },
        interested: function(userid, transactionid) {
            return $http({
                url: base + "/interested",
                method: "POST",
                data: {
                    userID: userid,
                    transactionID: transactionid
                }
            })
        },
        getMyInterests: function(userid) {
            return $http({
                url: base + "/getMyInterests",
                method: "POST",
                data: {
                    userID: userid,
                }
            })
        },
        notInterested: function(userid, transactionid) {
            return $http({
                url: base + "/notInterested",
                method: "POST",
                data: {
                    userID: userid,
                    transactionID: transactionid
                }
            })
        },
        getInterested: function(transactionid) {
            return $http({
                url: base + "/getInterested",
                method: "POST",
                data: {
                    transactionID: transactionid
                }
            })
        },
        update: function(_id, hidden) {
            return $http({
                url: base + "/update",
                method: "POST",
                data: {
                    _id: _id,
                    hidden: hidden
                }
            })
        },
        flagged: function(_id, hidden, flagged, userFlaggedReason) {
            return $http({
                url: base + "/flagged",
                method: "POST",
                data: {
                    _id: _id,
                    hidden: hidden,
                    flagged: flagged,
                    $push: {
                        flaggedReason: userFlaggedReason
                    }
                }
            })
        }
    }
})

.factory('UserAPI', function($http) {
    var base = "http://lookin4.herokuapp.com/api/users"
    return {
        new: function(userID, name, email) {
            return $http({
                url: base + "/new",
                method: "POST",
                data: {
                    userID: userID,
                    name: name,
                    email: email
                }
            })
        },
        get: function(userID) {
            return $http({
                url: base + "/get",
                method: "POST",
                data: {
                    userID: userID
                }
            })
        },
        update: function(userid, phone, caption, location) {
            return $http({
                url: base + "/update",
                method: "POST",
                data: {
                    userID: userid,
                    phone: phone,
                    caption: caption,
                    location: location
                },
            })
        },
        updateLocation: function(userid, location) {
            return $http({
                url: base + "/updateLocation",
                method: "POST",
                data: {
                    userID: userid,
                    deviceLocation: location
                }
            })
        },
        updateToken: function(userid, deviceToken) {
            return $http({
                url: base + "/updateToken",
                method: "POST",
                data: {
                    userID: userid,
                    deviceToken: deviceToken
                }
            })
        }
    }
})

.factory('ChatRoomAPI', function($http){
  var base = "http://lookin4.herokuapp.com/api/chatrooms"
  return {
    new: function(chatRoomID, user1ID, user2ID, user1Name, user2Name){
      return $http({
        url: base + "/new",
        method: "POST",
        data: {chatRoomId: chatRoomID, user1id: user1ID, user2id: user2ID, user1name: user1Name, user2name: user2Name}
      })
    },
    get: function(chatRoomID){
      return $http({
        url: base + "/get",
        method: "POST",
        data: {chatRoomId: chatRoomID}
      })
    },
    getUserChatrooms: function(userID){
      return $http({
        url: base + "/getUserChatrooms",
        method: "POST",
        data: {userid: userID}
      })
    },
    createID: function(id1, id2){

            if(id1 < id2)
            {
                small = id1;
                large = id2;
            }
            else
            {
                small = id2;
                large = id1;
            }

            return small.toString()+"&"+large.toString();
    }
  }
})

.factory('MessageAPI', function($http){
  var base = "http://lookin4.herokuapp.com/api/messages"
  return {
    new: function(chatRoomID, userID, date, text){
      return $http({
        url: base + "/new",
        method: "POST",
        data: {chatRoomId: chatRoomID, userID: userID, date: date, text: text}
      })
    },
    all: function(chatRoomID){
      return $http({
        url: base + "/all",
        method: "POST",
        data: {chatRoomId: chatRoomID}
      })
    },
    getNotSeenMessages: function(chatRoomID, userID){
      return $http({
        url: base + "/notseen",
        method: "POST",
        data: {chatRoomId: chatRoomID, userID: userID}
      })
    },
    setSeenMessage: function(_id){
      return $http({
        url: base + "/seen",
        method: "POST",
        data: {_id : _id}
      })
    },
    getLastMessage: function(chatRoomID){
      return $http({
        url: base + "/lastMessage",
        method: "POST",
        data: {chatRoomId: chatRoomID}
      })
    },
  }
})
