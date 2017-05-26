var LocalNotifications = require("nativescript-local-notifications");
var applicationSettings = require("application-settings");


/*
function createNotification(title, text) {

    if (applicationSettings.getBoolean("user.showNotifications", true))
        return;

    var context = utils.ad.getApplicationContext();

    var builder = new android.app.Notification.Builder(context);
    builder.setContentTitle(title)
        .setAutoCancel(true)
        .setContentText(text)
        //.setVibrate([100, 200, 100])
        .setSmallIcon(android.R.drawable.btn_star_big_on)
        .setDefaults(android.app.Notification.DEFAULT_ALL); //  .setDefaults( DEFAULT_SOUND | DEFAULT_VIBRATE | DEFAULT_LIGHTS )

    // will open main NativeScript activity when the notification is pressed
    var mainIntent = new android.content.Intent(context, com.tns.NativeScriptActivity.class);
    var pendingIntent = android.app.PendingIntent.getActivity(context,
        1,
        mainIntent,
        android.app.PendingIntent.FLAG_UPDATE_CURRENT);
    builder.setContentIntent(pendingIntent);
    builder.setDeleteIntent(getDeleteIntent(context));

    var manager = context.getSystemService(android.content.Context.NOTIFICATION_SERVICE);
    manager.notify(1, builder.build());
}

function getDeleteIntent(context) {
    var intent = new android.content.Intent(context, com.tns.broadcastreceivers.EventReceiver.class);
    intent.setAction("ACTION_DELETE_NOTIFICATION");
    return android.app.PendingIntent.getBroadcast(context, 0, intent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
}
*/


function createNotification(title, text) {

    if (!applicationSettings.getBoolean("user.showNotifications", true))
        return;

    LocalNotifications.schedule([{
        title: title,
        body: text
    }]).then(() => {
        console.log("Notification scheduled");
    }, (error) => {
        console.log("ERROR", error);
    });
}


module.exports.createNotification = createNotification;