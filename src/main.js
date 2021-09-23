const vscode = require("vscode");
const { sendRequest } = require("./postreq");
const path = require("path");
var io = require("socket.io-client");
const { time } = require("console");
// const axios = require("axios");

class PresenceReq {
    constructor(rpc) {
        this.url = "https://vscode-leaderboards.herokuapp.com/"
        this.rpc = rpc;
        this.lastDoc = "";
        this.lastFolder = "";
        this.lastTime = Date.now();
        this.startActivityTime = Date.now();
        // //get json from site
        // this.port = axios.get(this.url).then((res) => {
        //     console.log(res.data.port);
        // })

        this.socket = io(this.url);
        // this.socket.io.on("error", (err) => {
        //     console.log("error" + err);
        // });
        // console.log(socket);
        // this.socket.on("connect", function () {
        //     console.log("connected to localhost:3000");
        // });
        this.socket.emit("init", {userId: this.rpc.user.id, username: this.rpc.user.username});
        this.startListeningForEvents();
    }

    startListeningForEvents() {
        vscode.window.onDidChangeTextEditorSelection(
            this.selectionChangeHandler,
            this
        );
        vscode.workspace.onDidSaveTextDocument(
            this.textDocumentEventHandler,
            this
        );
        // console.log("Started listening for events");
    }

    sendHeartbeatIfOk(activeDoc) {
        let workspaceFolder = vscode.workspace.getWorkspaceFolder(
            activeDoc.uri
        );
        if (
            activeDoc.uri.path != this.lastDoc ||
            workspaceFolder.name != this.lastFolder
        ) {
            // console.log(this.lastDoc, this.lastFolder)
            // console.log(activeDoc.uri.path, workspaceFolder.name)
            // console.log("sending beat");
            this.changeActivity(activeDoc.uri.path, workspaceFolder.name);
        }
        let userData = {
            userId: this.rpc.user.id,
            username: this.rpc.user.username,
            time: Date.now(),
            lastTime: this.lastTime
        }
        this.socket.emit("sendTick", userData);
        this.lastDoc = activeDoc.uri.path;
        this.lastFolder = workspaceFolder.name;
        this.lastTime = Date.now();
        // console.log(socket)
    }

    textDocumentEventHandler(e) {
        this.sendHeartbeatIfOk(e);
    }

    selectionChangeHandler(e) {
        this.sendHeartbeatIfOk(e.textEditor.document);
    }

    changeActivity(filePath, workspace) {
        const filename = path.parse(filePath).base;
        this.rpc.setActivity({
            details: "Editing file " + filename,
            state: "Workspace " + workspace,
            startTimestamp: this.startActivityTime,
            largeImageKey: "lgicon",
            largeImageText: "VS Code",
        });
    }
}

module.exports = { PresenceReq };
