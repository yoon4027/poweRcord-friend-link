/* eslint-disable  */
const { Plugin } = require("powercord/entities");
const { getModule } = require("powercord/webpack");
const { createFriendInvite } = getModule(["createFriendInvite"], false);
const { getAllFriendInvites } = getModule(["getAllFriendInvites"], false);
const { revokeFriendInvites } = getModule(["revokeFriendInvites"], false);
class FriendLink extends Plugin {
  startPlugin() {
    powercord.api.commands.registerCommand({
      command: "flink",
      aliases: ["linkf", "friendlink", "rqlink"],
      description: "Generates a friend link for your account.",
      usage: "{c}",
      executor: this.onCommand.bind(this),
    });

    powercord.api.commands.registerCommand({
      command: 'viewlinks',
      description: "Views all your friend links.",
      usage: "{c}",
      executor: this.onViewLinks.bind(this),
    });

    powercord.api.commands.registerCommand({
      command: "deletelinks",
      description: "Deletes all of your friend links.",
      usage: "{c}",
      executor: this.onDeleteLink.bind(this),
    });
  }

  pluginWillUnload() {
    powercord.api.commands.unregisterCommand("flink");
  }

  async onCommand() {
    try {
      const { code } = await createFriendInvite();
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

  async onViewLinks() {
    try {
      const invites = await getAllFriendInvites();
      if (invites.length === 0) {
        return {
          send: false,
          result: "You have no friend links.",
        };
      }
      return {
        send: false,
        result: invites.map(invite => `https://discord.gg/${invite.code}`).join("\n"),
      };
    } catch (e) {
      this.log(e);
      return {
        send: false,
        result: "Failed to get your links.",
      };
    }
  }

  async onDeleteLink() {
    try {
      await revokeFriendInvites();
      return {
        send: false,
        result: "Successfully deleted all of your links.",
      };
    } catch (e) {
      this.log(e);
      return {
        send: false,
        result: "Failed to delete your links.",
      };
    }
  }

}

module.exports = FriendLink;