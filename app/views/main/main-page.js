var LabelModule = require("ui/label");
var StackLayout = require("ui/layouts/stack-layout");
var applicationSettings = require("application-settings");
var utils = require("utils/utils");
var connectivity = require("connectivity");
var frameModule = require("ui/frame");
var Toast = require("nativescript-toast");
var soundPlayer = require("nativescript-sound");
var alarm = require("~/alarm-setup");
var notifier = require("~/notifier");
var createViewModel = require("./main-view-model").createViewModel;



var page;
var worker = null;
var sound = soundPlayer.create('~/sounds/notification.mp3');
var viewModel = createViewModel();

sound.playOnlyOnce = function() {
    if (!this.playing) {
        this.playing = true;
        this.play();
        setTimeout(() => { this.playing = false; }, 5000);
    }
};

alarm.setupAlarm(utils.ad.getApplicationContext());

frameModule.Frame.defaultTransition = { name: "slide", duration: 300, curve: "easeIn" };



var connectionType = connectivity.getConnectionType();
if (connectionType == connectivity.connectionType.none)
    viewModel.set("isThereConnectivity", false);
else //  connectivity.connectionType.wifi  ||  connectivity.connectionType.mobile
    viewModel.set("isThereConnectivity", true);

connectivity.startMonitoring(function onConnectionTypeChanged(newConnectionType) {
    if (newConnectionType == connectivity.connectionType.none) {
        viewModel.set("isThereConnectivity", false);
        worker = null;
    } else { //  connectivity.connectionType.wifi  ||  connectivity.connectionType.mobile
        viewModel.set("isThereConnectivity", true);
        if (viewModel.get("configCompleted"))
            if (!worker)
                runWorker();
            else {
                viewModel.set("connectedToServer", false);
                worker.postMessage({ control: "reset" });
            }
    }
});



function runWorker(notify = false) {

    worker = new Worker("./worker");

    worker.onmessage = (msg) => {
        if (msg.data.control == "Disconnected") {
            viewModel.set("connectedToServer", false);
            worker = null;
            if (notify)
                Toast.makeText(" Couldn't connect to server ").show();
        } else if (msg.data.control == "Connected") {
            viewModel.set("connectedToServer", true);
            if (notify)
                Toast.makeText(" Connected to server ").show();
        } else {
            var sentFromServer = JSON.parse(msg.data.text);
            viewModel.addMessage(sentFromServer);
            if (applicationSettings.getString("app.state") != "running")
                notifier.createNotification("Notifier", msg.data.text);
            else
                sound.playOnlyOnce();
        }
    };

    worker.onerror = (e) => {
        viewModel.set("connectedToServer", false);
        worker = null;
        if (notify)
            Toast.makeText(" Error on server connection ").show();
    };

}



exports.onNavigatingTo = function(args) {
    //page = args.object;
    args.object.bindingContext = viewModel;

    if (applicationSettings.getString("server.ip", "") === "" || applicationSettings.getString("user.password", "") === "" || applicationSettings.getString("user.name", "") === "") {
        viewModel.set("configCompleted", false);
        if (worker) {
            viewModel.set("connectedToServer", false);
            worker.postMessage({ control: "terminate" });
            worker = null;
        }
    } else {
        viewModel.set("configCompleted", true);
        if (viewModel.get("isThereConnectivity")) {
            if (!worker)
                runWorker();
            else if (applicationSettings.getBoolean("config.changed", false)) {
                viewModel.set("connectedToServer", false);
                worker.postMessage({ control: "reset" });
            }
        }
    }

    applicationSettings.setBoolean("config.changed", false);
};

exports.onLoaded = function(args) {
    notifier.clearNotifications();
}

exports.goToConfig = () => {
    frameModule.topmost().navigate("views/config/config");
};

exports.retryConnection = () => {
    if (!worker)
        runWorker(true);
    else
        worker.postMessage({ control: "reset" });
}

exports.clearMessages = () => {
    viewModel.clearMessages();
}