const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

const animeIntervals = new Map();
module.exports = {
  name: "waifu",
  description:
    "Sends an waifu image immediately and every hour in this channel.",
  async execute(message, args) {
    const subCommand = args[0] ? args[0].toLowerCase() : null;
    const channelId = message.channel.id;

    if (subCommand === "stop") {
      if (animeIntervals.has(channelId)) {
        clearInterval(animeIntervals.get(channelId));
        animeIntervals.delete(channelId);
        message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setTitle("Waifu images stopped for this channel."),
          ],
        });
        console.log(
          `Waifu images stopped in ${message.guild.name} (#${message.channel.name})`
        );
      } else {
        message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setTitle("No waifu image interval is running in this channel."),
          ],
        });
      }
      return;
    }

    async function sendAnimeImage() {
      try {
        const response = await axios.get("https://api.waifu.pics/sfw/waifu");
        const imageUrl = response.data.url;

        const embed = new EmbedBuilder().setColor("#FFC0CB").setImage(imageUrl);

        await message.channel.send({ embeds: [embed] });
      } catch (error) {
        console.error("Failed to fetch waifu image:", error);
        message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setTitle("Failed to fetch a waifu image."),
          ],
        });
      }
    }

    await sendAnimeImage();
    if (animeIntervals.has(channelId)) {
      clearInterval(animeIntervals.get(channelId));
    }
    const interval = setInterval(sendAnimeImage, 2 * 60 * 1000);
    animeIntervals.set(channelId, interval);
  },
};
