/* eslint-disable  */
const { Plugin } = require("powercord/entities");
const { getModule } = require("powercord/webpack");

class FriendLink extends Plugin {
  startPlugin() {
    powercord.api.commands.registerCommand({
      command: "flink",
      aliases: ["linkf", "friendlink", "rqlink"],
      description: "Generates a friend link for your account.",
      usage: "{c}",
      executor: this.onCommand.bind(this),
    });
  }

  pluginWillUnload() {
    powercord.api.commands.unregisterCommand("flink");
  }

  async onCommand() {
    const { default: moduleDefault } = getModule(
      (m) => m.default && m.default.createFriendInvite,
      false
    );

    try {
      const { code } = await moduleDefault.createFriendInvite();
      return {
        send: false,
        result: `https://discord.gg/${code}`,
      };
    } catch (e) {
      this.log(e);
      return {
        send: false,
        result: "Failed to generate a link.",
      };
    }
  }
}

module.exports = FriendLink;
