const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "coinflip",
  description: "Flips a coin and returns heads or tails.",
  execute(message) {
    const result = Math.random() < 0.5 ? "Heads" : "Tails";

    const embed = new EmbedBuilder()
      .setColor("#FFD700")
      .setTitle(`**${result}**`)
      .setFooter({ text: `Flipped by ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

    message.channel.send({ embeds: [embed] });
  },
};
