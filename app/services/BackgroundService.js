var applicationSettings = require("application-settings");
var http = require("http");
var connectivity = require("connectivity");
var notifier = require("~/notifier");
var base64 = require("~/base64.js").Base64;


// 'android.app.IntentService' doesnt have an empty constructor so we use 'com.pip3r4o.android.app.IntentService'
com.pip3r4o.android.app.IntentService.extend("com.tns.notifications.BackgroundService", {
    onHandleIntent: function(intent) {
        var action = intent.getAction();
        if ("ACTION_START" == action) {
            doService();
        }
    }
});

function doService() {

    var text;
    console.log("Starting background service");

    //if user doesn't want notifications, there's no reason to fetch them
    if (!applicationSettings.getBoolean("user.showNotifications", true))
        return;

    //if app is running and on foreground, no need to do anything
    if (applicationSettings.getString("app.state") == "running") {
        console.log("Our app is on foreground, no need to do anything here");
        return;
    }

    var connectionType = connectivity.getConnectionType();
    if (connectionType == connectivity.connectionType.none) {
        console.log("No connectivity, nothing done in the service");
        return;
    }

    if (applicationSettings.getString("server.ip", "") === "" || applicationSettings.getString("user.password", "") === "" || applicationSettings.getString("user.name", "") === "") {
        console.log("Not configured yet, exiting background service");
        return;
    }

    http.request({
        url: "http://" + applicationSettings.getString("server.ip") + ":" + applicationSettings.getString("server.port", "80") + "/sse/check",
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Basic " + base64.encode(applicationSettings.getString("user.name", "") + ":" + applicationSettings.getString("user.password", "")) },
        content: JSON.stringify({ user: "myUserId", pass: "myPassword" })
    }).then(function(response) {
        respObj = response.content.toJSON();
        console.log("Got a result from the server: " + response.content);
        if (respObj.newNotifications > 0)
            notifier.createNotification("Notifier", "you've got " + respObj.newNotifications + " new notifications!");
    }, function(e) {
        console.log("Error occurred while checking the server for updates: " + e);
    });
}