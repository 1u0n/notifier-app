android.content.BroadcastReceiver.extend("com.tns.broadcastreceivers.EventReceiver", {
    onReceive: function(context, intent) {

        var action = intent.getAction();
        var serviceIntent = null;
        if ("ACTION_START_NOTIFICATION_SERVICE" == action) {
            serviceIntent = createIntentStartNotificationService(context);
        } else if ("ACTION_DELETE_NOTIFICATION" == action) {
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