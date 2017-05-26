var applicationSettings = require("application-settings");
var frameModule = require("ui/frame");
var utils = require("utils/utils");
var Observable = require("data/observable").Observable;
var Toast = require("nativescript-toast");
var alarm = require("~/alarm-setup");


var page;
var configData;


exports.onNavigatingTo = function() {
    console.log("PAGE onNavigatingTo");
};

exports.onLoaded = (args) => {
    console.log("PAGE onLoaded");

    configData = new Observable();
    configData.userName = applicationSettings.getString("user.name", "");
    configData.password = applicationSettings.getString("user.password", "");
    configData.showNotifications = applicationSettings.getBoolean("user.showNotifications", true);
    configData.ip = applicationSettings.getString("server.ip", "");
    configData.port = applicationSettings.getString("server.port", "80");
    configData.frequency = applicationSettings.getString("server.frequency", "10");

    page = args.object;
    page.bindingContext = configData;
}

exports.save = function() {

    if (configData.showNotifications && !applicationSettings.getBoolean("user.showNotifications", true))
        alarm.setupAlarm(utils.ad.getApplicationContext());
    else if (!configData.showNotifications && applicationSettings.getBoolean("user.showNotifications", true))
        alarm.cancelAlarm(utils.ad.getApplicationContext());

    applicationSettings.setString("user.name", configData.userName);
    applicationSettings.setString("user.password", configData.password);
    applicationSettings.setBoolean("user.showNotifications", configData.showNotifications);
    applicationSettings.setString("server.ip", configData.ip);
    applicationSettings.setString("server.port", configData.port);
    applicationSettings.setString("server.frequency", configData.frequency);

    Toast.makeText(" Changes saved ").show();
    frameModule.topmost().goBack();
};

exports.goBack = function() {
    frameModule.topmost().goBack();
}