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
    const id = rpc.user.id;
    const username = rpc.user.username;
    console.log("Extensionjs" + id + " " + username);
    console.log("Rich Presence is now ready");
    
    const requests = new PresenceReq(rpc, activeDate);
    console.log(requests);
    console.log("Initialization complete!");
  });

  let test = vscode.commands.registerCommand(
    "betterpresence.helloWorld",
    function () {
      vscode.window.showInformationMessage("Hello World from BetterPresence!");
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
