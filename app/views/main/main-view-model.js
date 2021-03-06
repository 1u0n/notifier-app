var Observable = require("data/observable").Observable;
var fs = require("file-system");
var dialogs = require("ui/dialogs");
var ObservableArray = require("data/observable-array").ObservableArray;


var viewModel = new Observable();
var messagesFile;

exports.createViewModel = () => {

    viewModel.messages = new ObservableArray([]);
    viewModel.configCompleted = false;
    viewModel.connectedToServer = false;

    var path = fs.path.join(fs.knownFolders.documents().path, "data", "messages");
    //if (!fs.File.exists(path))
    messagesFile = fs.File.fromPath(path);
    messagesFile.readText()
        .then((content) => {
            if (content) {
                viewModel.messages.push(content.split("\n"));
                var length = viewModel.messages.length;
                for (var i = 0; i < length; i++) {
                    var obj = JSON.parse(viewModel.messages.getItem(i));
                    obj.odd = i % 2 == 0 ? false : true;
                    viewModel.messages.setItem(i, obj);
                }
            }
        }, (error) => {
            dialogs.alert({
                title: "Error",
                message: "Couldn't read your stored messages",
                okButtonText: "OK"
            });
        });

    viewModel.addMessage = function(message) {

        var length = this.messages.length;
        var objectToStore = { agent: message.agent, text: message.text, time: message.time };
        objectToStore.odd = length % 2 == 0 ? false : true;
        var contentString = "";
        for (var i = 0; i < length; i++)
            contentString += JSON.stringify(this.messages.getItem(i)) + "\n";
        contentString += JSON.stringify(objectToStore);

        messagesFile.writeText(contentString)
            .then(() => {
                viewModel.messages.push(objectToStore);
            }, (error) => {
                dialogs.alert({
                    title: "Error",
                    message: "Couldn't store new arrived message",
                    okButtonText: "OK"
                });
            });
    };


    viewModel.clearMessages = function() {
        messagesFile.writeText("");
        var length = this.messages.length;
        for (var i = 0; i < length; i++)
            this.messages.pop();
    };


    return viewModel;
}