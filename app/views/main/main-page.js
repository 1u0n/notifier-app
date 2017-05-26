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



if (!applicationSettings.getBoolean("app.launched", false))
    setUpMainPage();

var page;
var worker = null;
var sound = soundPlayer.create('~/sounds/notification.mp3');
var viewModel = createViewModel();



function setUpMainPage() {

}


alarm.setupAlarm(utils.ad.getApplicationContext());

frameModule.Frame.defaultTransition = { name: "slide", duration: 300, curve: "easeIn" };



var connectionType = connectivity.getConnectionType();
if (connectionType == connectivity.connectionType.none) {
    console.log("Starting with no connection");
    viewModel.set("isThereConnectivity", false);
} else { //  connectivity.connectionType.wifi  ||  connectivity.connectionType.mobile
    console.log("Starting connected");
    viewModel.set("isThereConnectivity", true);
}
connectivity.startMonitoring(function onConnectionTypeChanged(newConnectionType) {
    if (newConnectionType == connectivity.connectionType.none) {
        console.log("Connection type changed to none.");
        viewModel.set("isThereConnectivity", false);
        if (worker) {
            worker.terminate();
            worker = null;
        }
    } else { //  connectivity.connectionType.wifi  ||  connectivity.connectionType.mobile
        console.log("Connection type changed to connected");
        viewModel.set("isThereConnectivity", true);
        if (!worker && viewModel.get("configCompleted"))
            worker = runWorker();
    }
});



function runWorker(notify = false) {

    worker = new Worker("./worker");

    worker.onmessage = (msg) => {
        if (msg.data.control == "Disconnected") {
            console.log("recibido Disconnected del worker, y el worker es: " + (worker === null ? "nulo" : "no nulo"));
            viewModel.set("connectedToServer", false);
            if (notify)
                Toast.makeText(" Couldn't connect to server ").show();
            worker = null;
        } else if (msg.data.control == "Connected") {
            viewModel.set("connectedToServer", true);
            if (notify)
                Toast.makeText(" Connected to server ").show();
        } else {
            var sentFromServer = JSON.parse(msg.data.text);
            console.log("Going to add a message to viewModel");
            viewModel.addMessage(sentFromServer);

            if (applicationSettings.getString("app.state") != "running")
                notifier.createNotification("Notifier", msg.data.text);
            else
                sound.play();
        }
    };

    worker.onerror = (e) => {
        console.log("Error thrown and not caught in worker thread: " + e.message);
        if (worker)
            worker.terminate();
        if (notify)
            Toast.makeText(" Error while trying to connect ").show();
    };

}



exports.closeSse = function() {
    //sse.close();
};

exports.onNavigatingTo = function(args) {
    console.log("PAGE onNavigatingTo");
    //page = args.object;
    args.object.bindingContext = viewModel;

    if (applicationSettings.getString("server.ip", "") === "" || applicationSettings.getString("user.password", "") === "" || applicationSettings.getString("user.name", "") === "") {
        viewModel.set("configCompleted", false);
    } else {
        viewModel.set("configCompleted", true);
        if (!worker && viewModel.get("isThereConnectivity"))
            worker = runWorker();
    }
};

exports.goToConfig = () => {
    frameModule.topmost().navigate("views/config/config");
};

exports.retryConnection = () => {
    if (!worker)
        worker = runWorker(true);
}

exports.clearMessages = () => {
    viewModel.clearMessages();
}