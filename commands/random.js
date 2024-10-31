const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

const activeIntervals = new Map();

module.exports = {
  name: "random",
  description: "Sends a random fact immediately or at set intervals in the channel.",
  async execute(message, args) {
    const channelId = message.channel.id;
    const subcommand = args[0];

    async function sendRandomFact() {
      try {
        const response = await axios.get("https://uselessfacts.jsph.pl/random.json?language=en");
        const fact = response.data.text;

        const embed = new EmbedBuilder()
          .setColor("#3498db")
          .setTitle("Random Fact")
          .setDescription(fact)
          .setTimestamp();

        await message.channel.send({ embeds: [embed] });
      } catch (error) {
        console.error("Failed to fetch random fact:", error);
        message.channel.send({
          embeds: [new EmbedBuilder().setColor("#FF0000").setTitle("Failed to fetch a random fact.")],
        });
      }
    }

    if (subcommand === "stop") {
      if (activeIntervals.has(channelId)) {
        clearInterval(activeIntervals.get(channelId));
        activeIntervals.delete(channelId);
        message.channel.send({
          embeds: [new EmbedBuilder().setColor("#FF0000").setTitle("Stopped random fact interval for this channel.")],
        });
        console.log(`\x1b[1m\x1b[31m${message.author.username} stopped random fact interval in ${message.guild.name}\x1b[0m`);
      } else {
        message.channel.send({
          embeds: [new EmbedBuilder().setColor("#FF0000").setTitle("No active random fact interval to stop.")],
        });
      }
      return;
    }

    if (subcommand && subcommand.endsWith("m")) {
      const intervalMinutes = parseInt(subcommand.slice(0, -1));

      if (isNaN(intervalMinutes) || intervalMinutes < 5 || intervalMinutes > 1440) {
        message.channel.send({
          embeds: [new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("Invalid Interval")
            .setDescription("Please provide an interval between 5 minutes and 1440 minutes (1 day).")],
        });
        return;
      }

      if (activeIntervals.has(channelId)) {
        clearInterval(activeIntervals.get(channelId));
      }
      activeIntervals.set(channelId, setInterval(sendRandomFact, intervalMinutes * 60 * 1000));
      
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle("Random Fact Interval Started")
            .setDescription(`Sending a random fact every ${intervalMinutes} minutes in this channel.`),
        ],
      });
      console.log(`\x1b[1m\x1b[36m${message.author.username} started random fact interval every ${intervalMinutes} mins in ${message.guild.name}\x1b[0m`);
    } else {
      await sendRandomFact();
    }
  },
};
