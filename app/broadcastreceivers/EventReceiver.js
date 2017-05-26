android.content.BroadcastReceiver.extend("com.tns.broadcastreceivers.EventReceiver", {
    onReceive: function(context, intent) {
        var action = intent.getAction();
        var serviceIntent = null;
        if ("ACTION_START_NOTIFICATION_SERVICE" == action) {
            console.log("onReceive from alarm, starting notification service! thread: " + java.lang.Thread.currentThread().getName());
            serviceIntent = createIntentStartNotificationService(context);
        } else if ("ACTION_DELETE_NOTIFICATION" == action) {
            console.log("onReceive delete notification action, starting notification service to handle delete");
            serviceIntent = createIntentDeleteNotification(context);
        }

        if (serviceIntent) {
            context.startService(serviceIntent);
        }
    }
})

var Intent = android.content.Intent;


function createIntentStartNotificationService(context) {
    var intent = new Intent(context, com.tns.notifications.BackgroundService.class);
    intent.setAction("ACTION_START");
    return intent;
}

function createIntentDeleteNotification(context) {
    var intent = new Intent(context, com.tns.notifications.BackgroundService.class);
    intent.setAction("ACTION_DELETE");
    return intent;
}