const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "clear",
  description: "Clears a specified number of messages from the channel.",
  async execute(message, args) {
    const amount = parseInt(args[0]);

    if (isNaN(amount)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("Error")
            .setDescription("Please define the number of messages to clear!"),
        ],
      });
    }

    try {
      await message.channel.bulkDelete(amount, true);
      const confirmationMessage = await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#00FF00")
            .setDescription(`🧹 Cleared ${amount} messages!`),
        ],
      });
      console.log(
        `\x1b[1m\x1b[92m${message.author.username} has cleared ${amount} messages in ${message.guild.name}.\x1b[0m`
      );
      setTimeout(() => confirmationMessage.delete().catch(console.error), 5000);

    } catch (error) {
      console.error("Failed to delete messages:", error);
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("Error")
            .setDescription("There was an error trying to delete messages in this channel!"),
        ],
      });
    }
  },
};
