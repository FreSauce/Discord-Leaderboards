const RPC = require("discord-rpc");
const vscode = require("vscode");

let activeDate = null;
/**
 * @param {vscode.ExtensionContext} context
 */
const rpc = new RPC.Client({
  transport: "ipc",
});

rpc.login({
  clientId: "850639416669110272",
});
const { PresenceReq } = require("./main");

function activate(context) {
  rpc.on("ready", () => {
    activeDate = new Date();
    rpc.setActivity({
      details: "Detecting Filename",
      state: "Detecting Workspace",
      startTimestamp: activeDate,
      largeImageKey: "lgicon",
      largeImageText: "VS Code",
    });
    const requests = new PresenceReq(rpc);
    vscode.window.showInformationMessage("uwu Thank you for using this extension...");
  });

  let test = vscode.commands.registerCommand(
    "betterpresence.about",
    function () {
      vscode.window.showInformationMessage("Yo, thanks for hitting the about button! I really appreciate it [Message me at FreSauce#5465 on discord]");
    }
  );
  context.subscriptions.push(test);
}

function deactivate() {
  vscode.window.showInformationMessage("The extension has been deactivated!");
}

module.exports = {
  activate,
  deactivate
};
