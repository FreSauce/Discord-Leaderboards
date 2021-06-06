const vscode = require("vscode");
const { sendRequest } = require("./postreq");
const path = require("path");

class PresenceReq {
  constructor(rpc, activeDate) {
    this.rpc = rpc;
    this.activeDate = activeDate;
    this.lastHeartbeatAt = null;
    this.heartbeatDuration = 120000; // 120 seconds
    this.startListeningForEvents();
  }

  startListeningForEvents() {
    vscode.window.onDidChangeTextEditorSelection(
      this.selectionChangeHandler,
      this
    );
    vscode.workspace.onDidSaveTextDocument(this.textDocumentEventHandler, this);
    console.log("Started listening for events");
  }

  sendHeartbeatIfOk(activeDoc) {
    let now = Date.now();
    if (
      !this.lastHeartbeatAt ||
      now > this.lastHeartbeatAt + this.heartbeatDuration
    ) {
      const workspaceFolder = vscode.workspace.getWorkspaceFolder(
        activeDoc.uri
      );
      sendRequest(
        this.rpc.user.id,
        this.rpc.user.username,
        now - this.lastHeartbeatAt
      );
      console.log(
        "Sent heartbeat!, " + activeDoc.fileName + " " + workspaceFolder.name
      );
      this.lastHeartbeatAt = now;
      this.changeActivity(activeDoc.fileName, workspaceFolder.name);
    } else {
      console.log(
        `Not sending heartbeat because for some reason. lastHeartbeatAt: ${
          this.lastHeartbeatAt
        }. duration: ${this.heartbeatDuration}. now: ${now} time_rem: ${
          now - this.lastHeartbeatAt
        }`
      );
    }
  }

  textDocumentEventHandler(e) {
    this.sendHeartbeatIfOk(e);
  }

  selectionChangeHandler(e) {
    this.sendHeartbeatIfOk(e.textEditor.document);
  }

  changeActivity(filePath, workspace) {
    const filename = path.parse(filePath).base
    console.log("In extension.js ");
    console.log(
      "In extension.js " + filename + " " + workspace + " " + this.activeDate
    );
    this.rpc.setActivity({
      details: "Editing file " + filename,
      state: "Workspace " + workspace,
      startTimestamp: this.activeDate,
      largeImageKey: "lgicon",
      largeImageText: "VS Code",
    });
  }
}

module.exports = { PresenceReq };
