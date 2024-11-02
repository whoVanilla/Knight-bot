const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

let animeInterval;

module.exports = {
  name: "waifu",
  description: "Sends an anime image immediately and every hour in this channel.",
  async execute(message, args) {
    const subCommand = args[0] ? args[0].toLowerCase() : null;

    if (subCommand === "stop") {
      if (animeInterval) {
        clearInterval(animeInterval);
        animeInterval = null;
        message.channel.send({
          embeds: [
            new EmbedBuilder().setColor("#FF0000").setTitle("Anime images stopped."),
          ],
        });
        console.log(`Anime images stopped in ${message.guild.name}`);
      } else {
        message.channel.send({
          embeds: [
            new EmbedBuilder().setColor("#FF0000").setTitle("No anime image interval is running in this channel."),
          ],
        });
      }
      return;
    }

    async function sendAnimeImage() {
      try {
        const response = await axios.get("https://api.waifu.pics/sfw/waifu");
        const imageUrl = response.data.url;

        const embed = new EmbedBuilder()
          .setColor("#FFC0CB")
          .setImage(imageUrl);

        await message.channel.send({ embeds: [embed] });
      } catch (error) {
        console.error("Failed to fetch anime image:", error);
        message.channel.send({
          embeds: [new EmbedBuilder().setColor("#FF0000").setTitle("Failed to fetch an anime image.")],
        });
      }
    }

    await sendAnimeImage();

    animeInterval = setInterval(sendAnimeImage, 60 * 60 * 1000);
  },
};
