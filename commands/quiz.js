const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const axios = require("axios");

let quizInterval;
let inactivityTimer;

module.exports = {
  name: "quiz",
  description: "Starts a true/false quiz in this channel.",
  async execute(message, args) {
    if (quizInterval) {
      clearInterval(quizInterval);
      quizInterval = null;
      clearTimeout(inactivityTimer);
      
      message.channel.send({
        embeds: [new EmbedBuilder().setColor("#FF0000").setTitle("The quiz has been stopped.")],
      });
      console.log(`${message.author.username} stopped the quiz in ${message.guild.name}.`);
      return;
    }

    console.log(`\x1b[0mA quiz has been started in \x1b[32m${message.guild.name} \x1b[0mby \x1b[1m\x1b[95m${message.author.username}.`);
    message.channel.send({
      embeds: [new EmbedBuilder().setColor("#00FF00").setTitle("The quiz has started!")],
    });

    async function sendQuizQuestion() {
      try {
        const response = await axios.get("https://opentdb.com/api.php?amount=1&type=boolean");
        const question = response.data.results[0].question;
        const correctAnswer = response.data.results[0].correct_answer;

        const embed = new EmbedBuilder()
          .setColor("#3498db")
          .setTitle("True or False?")
          .setDescription(question);

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId("true").setLabel("True").setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId("false").setLabel("False").setStyle(ButtonStyle.Danger)
        );

        const quizMessage = await message.channel.send({ embeds: [embed], components: [row] });

        const filter = (interaction) =>
          interaction.isButton() &&
          ["true", "false"].includes(interaction.customId) &&
          interaction.message.id === quizMessage.id;

        const collector = quizMessage.createMessageComponentCollector({
          filter,
          time: 5 * 60 * 1000, 
        });

        const usersAnswered = new Set();

        inactivityTimer = setTimeout(() => {
          clearInterval(quizInterval);
          quizInterval = null;
          message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("#FF0000")
                .setTitle("The quiz has stopped due to inactivity."),
            ],
          });
          console.log(`The quiz stopped in \x1b[1m\x1b[32m${message.guild.name} due to inactivity.`);
        }, 5 * 60 * 1000); 

        collector.on("collect", (interaction) => {
          const userId = interaction.user.id;
          
          if (usersAnswered.has(userId)) {
            interaction.reply({ content: "You've already answered this question!", ephemeral: true });
            return;
          }

          const answer = interaction.customId === "true" ? "True" : "False";
          const isCorrect = answer === correctAnswer;

          usersAnswered.add(userId);

          if (isCorrect) {
            interaction.reply({
              embeds: [new EmbedBuilder().setColor("#00FF00").setDescription(`${interaction.user} answered correctly!`)],
            });
          } else {
            interaction.reply({
              embeds: [new EmbedBuilder().setColor("#FF0000").setDescription(`${interaction.user} answered incorrectly!`)],
            });
          }
        });

        collector.on("end", () => {
          clearTimeout(inactivityTimer);
        });
      } catch (error) {
        console.error("Failed to fetch quiz question:", error);
      }
    }

    await sendQuizQuestion();

    quizInterval = setInterval(sendQuizQuestion, 5 * 60 * 1000);
  },
};
