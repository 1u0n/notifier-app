var applicationSettings = require("application-settings");

function setupAlarm(context) {

    var alarmIntent = getIntent(context);
    var alarmManager = context.getSystemService(android.content.Context.ALARM_SERVICE);
    alarmManager.setInexactRepeating(android.app.AlarmManager.RTC,
        java.lang.System.currentTimeMillis(),
        1000 * 60 * parseInt(applicationSettings.getString("server.frequency", "10")), // <- every 10 minutes by default
        alarmIntent);
}

function cancelAlarm(context) {
    var alarmIntent = getIntent(context);
    var alarmManager = context.getSystemService(android.content.Context.ALARM_SERVICE);
    alarmManager.cancel(alarmIntent);
}

function getIntent(context) {
    var intent = new android.content.Intent(context, com.tns.broadcastreceivers.EventReceiver.class);
    intent.setAction("ACTION_START_NOTIFICATION_SERVICE");
    return android.app.PendingIntent.getBroadcast(context, 0, intent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
}


module.exports.setupAlarm = setupAlarm;
module.exports.cancelAlarm = cancelAlarm;