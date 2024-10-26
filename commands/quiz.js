const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const axios = require("axios");

let quizInterval;
let isQuizActive = false;

module.exports = {
    name: "quiz",
    async execute(message) {
        if (isQuizActive) {
            clearInterval(quizInterval);
            isQuizActive = false;
            const stopEmbed = new EmbedBuilder()
                .setColor('#000000')
                .setDescription("Quiz has been stopped.");
            return message.channel.send({ embeds: [stopEmbed] });
        }

        isQuizActive = true;
        const startEmbed = new EmbedBuilder()
            .setColor('#ffffff')
            .setTitle("Quiz has started!")
            .setDescription("Answer each question with True or False. Type `!quiz` again to stop.");
        message.channel.send({ embeds: [startEmbed] });

        const fetchQuestion = async () => {
            try {
                const response = await axios.get("https://opentdb.com/api.php?amount=1&type=boolean");
                const questionData = response.data.results[0];
                const questionEmbed = new EmbedBuilder()
                    .setColor('#ab7aff')
                    .setTitle("True or False?")
                    .setDescription(questionData.question);

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("true")
                            .setLabel("True")
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId("false")
                            .setLabel("False")
                            .setStyle(ButtonStyle.Danger)
                    );

                const questionMessage = await message.channel.send({
                    embeds: [questionEmbed],
                    components: [row],
                });

                const filter = (interaction) => {
                    return ["true", "false"].includes(interaction.customId) && !interaction.user.bot;
                };

                const collector = questionMessage.createMessageComponentCollector({
                    filter,
                    time: 15000,
                });

                collector.on("collect", async (interaction) => {
                    const userAnswer = interaction.customId === "true" ? "True" : "False";
                    const correctAnswer = questionData.correct_answer;

                    const resultEmbed = new EmbedBuilder()
                        .setColor(0x3a3763)
                        .setTitle(userAnswer === correctAnswer ? "Correct!" : "Wrong!")
                        .setDescription(`The correct answer was: **${correctAnswer}**`);

                    await interaction.update({
                        embeds: [resultEmbed],
                        components: [],
                    });

                    collector.stop();
                });

                collector.on("end", (collected, reason) => {
                    if (reason === "time") {
                        const timeoutEmbed = new EmbedBuilder()
                            .setColor('#fc0303')
                            .setDescription("Time's up! No one answered in time.");
                        questionMessage.edit({
                            embeds: [timeoutEmbed],
                            components: [],
                        });
                    }
                });
            } catch (error) {
                console.error(error);
                const errorEmbed = new EmbedBuilder()
                    .setColor('#fc0303')
                    .setDescription("An error occurred while fetching the quiz question.");
                message.channel.send({ embeds: [errorEmbed] });
            }
        };

        fetchQuestion();
        quizInterval = setInterval(fetchQuestion, 1200000);
    },
};
