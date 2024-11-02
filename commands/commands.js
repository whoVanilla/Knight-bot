const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'commands',
    execute(message) {
        const commandsEmbed = new EmbedBuilder()
            .setColor('#ffb8c8')
            .setTitle('All available commands for Knight bot')
            .setThumbnail('https://camo.githubusercontent.com/66973493099bd0b5991dd040ba1811a97678c8142e24fc1a0c3063a496e94f78/68747470733a2f2f646973636f7264732e636f6d2f5f6e6578742f696d6167653f75726c3d687474707325334125324625324663646e2e646973636f72646170702e636f6d253246656d6f6a69732532463531373337373334323230353732323636342e706e67253346762533443126773d363426713d3735')
            .setDescription([
                'The full list of commands is available on the **[Github Page](https://github.com/whoVanilla/knight-bot?tab=readme-ov-file#knight-bot-for-discord-)** along with the [Source Code](https://github.com/whoVanilla/knight-bot) of this bot.'
            ].join('\n'));

        message.channel.send({ embeds: [commandsEmbed] });
    },
};
