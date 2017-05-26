android.content.BroadcastReceiver.extend("com.tns.broadcastreceivers.AlarmRestarter", {
    onReceive: function() {
        var helper = require("~/alarm-setup");
        var utils = require("utils/utils");
        helper.setupAlarm(utils.ad.getApplicationContext());
    }
});