cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/com.pushapps.phonegap/www/pushapps.js",
        "id": "com.pushapps.phonegap.PushApps",
        "clobbers": [
            "PushNotification"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.device": "0.2.7",
    "com.pushapps.phonegap": "1.0.0",
    "org.apache.cordova.console": "0.2.6"
}
// BOTTOM OF METADATA
});