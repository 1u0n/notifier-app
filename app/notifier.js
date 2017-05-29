var LocalNotifications = require("nativescript-local-notifications");
var applicationSettings = require("application-settings");


function createNotification(title, text) {

    if (!applicationSettings.getBoolean("user.showNotifications", true))
        return;

    LocalNotifications.schedule([{
        title: title,
        body: text
    }]).then((error) => {
        console.error("Error creating notification: ", error);
    });
}


function clearNotifications() {
    LocalNotifications.cancelAll();
}


module.exports.createNotification = createNotification;
module.exports.clearNotifications = clearNotifications;