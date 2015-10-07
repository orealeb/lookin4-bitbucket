// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('lookin4', ['ionic', 'lookin4.controllers', 'lookin4.factory', 'lookin4.filters', 'monospaced.elastic', 'angularMoment','cordovaGeolocationModule'])

.run(function($ionicPlatform,  $rootScope, PushNotification,  $ionicPopup) {
  $ionicPlatform.ready(function() {

          if(window.Connection) {
              console.log(navigator.connection.type);
                if(navigator.connection.type == Connection.NONE) {
                    $ionicPopup.alert({
                        title: "Internet Disconnected",
                        content: "The internet is disconnected on your device."
                    })
                    .then(function(result) {
                            ionic.Platform.exitApp();
                    });
                }
            }
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  


  });

  //$rootScope.registered = (localStorage.getItem("registered") === "true") ? true: false;

//listener for push notifications - show alert
  document.addEventListener('pushapps.message-received', function(event) {
    var notification = event.notification;
    console.log(notification);
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  openFB.init({appId: '684585124984098'});
  $stateProvider
  .state('login', {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: 'LoginCtrl'
  })
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
  })

  .state('app.gigs', {
    url: "/gigs",
    views: {
      'menuContent': {
        templateUrl: "templates/gigs.html"
      }
    }
  })

  .state('app.interested', {
    cache: false,
    url: "/interested",
    views: {
      'menuContent': {
        templateUrl: "templates/interested.html"
      }
    }
  })

  .state('app.profile', {
    url: "/profile",
    views: {
      'menuContent': {
        templateUrl: "templates/profile.html"
      }
    }
  })

  .state('app.newgig', {
    url: "/newgig",
    views: {
      'menuContent': {
        templateUrl: "templates/newgig.html"
      }
    }
  })

 .state('app.usermessages', {
  url: "/usermessages",
    views: {
      'menuContent': {
        templateUrl: "templates/usermessages.html"
      }
    }
  })
 
  .state('app.myinterests', {
  url: "/myinterests",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/myinterests.html"
      }
    }
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
