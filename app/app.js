var application = require("application");
var applicationSettings = require("application-settings");


function setRunning() {
    applicationSettings.setString("app.state", "running");
}

function setStopped() {
    applicationSettings.setString("app.state", "stopped");
}

application.on(application.launchEvent, setRunning);
application.on(application.resumeEvent, setRunning);

application.on(application.suspendEvent, setStopped);
application.on(application.exitEvent, setStopped);
application.on(application.uncaughtErrorEvent, setStopped);




application.start({ moduleName: "views/main/main-page" });