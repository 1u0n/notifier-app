var application = require("application");
var applicationSettings = require("application-settings");

function setRunning() {
    applicationSettings.setString("app.state", "running");
    console.log("app state changed to Running");
}

function setStopped() {
    applicationSettings.setString("app.state", "stopped");
    console.log("app state changed to Stopped");
}

application.on(application.launchEvent, setLaunch);
application.on(application.resumeEvent, setResume);

application.on(application.suspendEvent, setSuspend);
application.on(application.exitEvent, setExit);
application.on(application.uncaughtErrorEvent, setError);

function setLaunch() {
    applicationSettings.setString("app.state", "running");
    applicationSettings.setBoolean("app.launched", true);
    console.log("JUAN: LAUNCH EVENT");
}

function setResume() {
    applicationSettings.setString("app.state", "running");
    console.log("JUAN: RESUME EVENT");
}

function setSuspend() {
    applicationSettings.setString("app.state", "stopped");
    console.log("JUAN: SUSPEND EVENT");
}

function setExit() {
    applicationSettings.setString("app.state", "stopped");
    applicationSettings.setBoolean("app.launched", false);
    console.log("JUAN: EXIT EVENT");
}

function setError() {
    applicationSettings.setString("app.state", "stopped");
    applicationSettings.setBoolean("app.launched", false);
    console.log("JUAN: ERROR EVENT");
}




application.start({ moduleName: "views/main/main-page" });