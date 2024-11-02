const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

const intervals = {};

module.exports = {
  name: "fact",
  description: "Send a random fact or set an interval for random facts.",
  async execute(message, args) {
    const channel = message.channel;
    const user = message.author;

    async function sendRandomFact() {
      try {
        const response = await axios.get("https://uselessfacts.jsph.pl/random.json?language=en");
        const fact = response.data.text;

        const factEmbed = new EmbedBuilder()
          .setColor("#ab7aff")
          .setTitle("Random Fact ✨")
          .setDescription(fact);
        channel.send({ embeds: [factEmbed] });
      } catch (error) {
        console.error("Error fetching random fact:", error);
        channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription("Failed to fetch a random fact."),
          ],
        });
      }
    }

    if (args[0] === "stop") {
      if (intervals[channel.id] && intervals[channel.id].intervalId) {
        clearInterval(intervals[channel.id].intervalId);
        delete intervals[channel.id];
        message.channel.send({
          embeds: [
            new EmbedBuilder().setColor("#FF0000").setTitle("Random fact updates have been stopped for this channel."),
          ],
        });
        console.log(`\x1b[31m${user.username} stopped the random fact interval in ${message.guild.name}.\x1b[0m`);
      } else {
        message.channel.send({
          embeds: [
            new EmbedBuilder().setColor("#FF0000").setDescription("No active interval to stop."),
          ],
        });
      }
      return;
    }

    if (args[0] === "interval") {
      const channelData = intervals[channel.id];
      if (channelData) {
        const embed = new EmbedBuilder()
          .setColor("#3498db")
          .setTitle("Random Fact Interval")
          .setDescription(`Current interval: ${channelData.time} minutes`)
          .addFields(
            { name: "Set By", value: channelData.setBy, inline: true },
            { name: "Set At", value: channelData.setAt, inline: true }
          );
        message.channel.send({ embeds: [embed] });
      } else {
        message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription("No random facts interval set in this channel."),
          ],
        });
      }
      return;
    }

    if (!args[0]) {
      sendRandomFact();
      return;
    }

    const intervalTime = parseInt(args[0]);
    if (!intervalTime || intervalTime < 5 || intervalTime > 1440) {
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("Please provide an interval between 5 minutes and 1440 minutes (1 day)."),
        ],
      });
      return;
    }

    if (intervals[channel.id]) {
      clearInterval(intervals[channel.id].intervalId);
    }

    sendRandomFact();
    const intervalId = setInterval(sendRandomFact, intervalTime * 60 * 1000);

    intervals[channel.id] = {
      intervalId,
      time: intervalTime,
      setBy: user.username,
      setAt: new Date().toLocaleString(),
    };

    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("#00FF00")
          .setTitle("Random Fact Interval Set")
          .setDescription(`A random fact will be sent every ${intervalTime} minutes.`),
      ],
    });
    console.log(`\x1b[33m${user.username} set a ${intervalTime}-minute interval for random facts in ${message.guild.name}.\x1b[0m`);
  },
};
