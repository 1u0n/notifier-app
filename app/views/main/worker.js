require('globals');
var applicationSettings = require("application-settings");
var SSE = require("nativescript-sse").SSE;
var base64 = require("~/base64.js").Base64;


var sse;
connectSSE();

function connectSSE() {
    var url = "http://" + applicationSettings.getString("server.ip") + ":" + applicationSettings.getString("server.port") + "/sse/connect";
    var auth = "Basic " + base64.encode(applicationSettings.getString("user.name", "") + ":" + applicationSettings.getString("user.password", ""));

    sse = new SSE(url, {
        "Accept-Encoding": "gzip, deflate",
        "Connection": "keep-alive",
        "Pragma": "no-cache",
        "Authorization": auth
    });

    sse.events.on('onConnect', (data) => {
        postMessage({ control: "Connected" });
    });

    sse.events.on('onMessage', (data) => {
        var eventName = data.object.event;
        if (eventName == "disconnect")
            postMessage({ control: "Disconnected" });
        else
            postMessage({ "text": data.object.message.data, "eventName": (eventName != "message" ? eventName + ": " : undefined) });
    });

    sse.events.on('onError', (data) => {
        postMessage({ control: "Disconnected" });
        close();
    });

}


//currently main thread only sends 'reset' and 'terminate' messages to this worker
global.onmessage = function(msg) {

    if (sse)
        sse.close();

    if (msg.data.control === "reset")
        connectSSE();
    else if (msg.data.control === "terminate") {}

}



global.onclose = function() {
    if (sse)
        sse.close();
}


global.onerror = function(e) {
    postMessage({ control: "Disconnected" });
    close();
    return true;
}