require('globals');
var applicationSettings = require("application-settings");
var SSE = require("nativescript-sse").SSE;
var base64 = require("~/base64.js").Base64;

//console.log("el Base64 es: " + btoa("test:test"));       btoa("test:test") = 'dGVzdDp0ZXN0'

var sse = new SSE("http://" + applicationSettings.getString("server.ip") + ":" + applicationSettings.getString("server.port") + "/sse/connect", {
    "Accept-Encoding": "gzip, deflate",
    "Connection": "keep-alive",
    "Pragma": "no-cache",
    "Authorization": "Basic " + base64.encode(applicationSettings.getString("user.name", "") + ":" + applicationSettings.getString("user.password", ""))
});

sse.events.on('onConnect', (data) => {
    postMessage({ control: "Connected" });
});
sse.events.on('onMessage', (data) => {

    console.log("Data recibido: " + data.object.message.data);

    var eventName = data.object.event;

    if (eventName == "disconnect")
        postMessage({ control: "Disconnected" });
    else
        postMessage({ "text": data.object.message.data, "eventName": (eventName != "message" ? eventName + ": " : undefined) });
});
sse.events.on('onError', (data) => {
    console.log("unexpected SSE connection cut: " + data.object.error);
    postMessage({ control: "Disconnected" });
    close();
});



/*
onmessage = function(msg) { console.log("Message received from main thread: " + msg.data); }
*/


global.onclose = function() {
    console.log("Closing down the worker, and sse is " + (sse === null ? "null" : "no null"));
    if (sse)
        sse.close();
}


global.onerror = function(e) {
    console.log("Error thrown in worker: " + e);
    postMessage({ control: "Disconnected" });
    close();
    return true;
}