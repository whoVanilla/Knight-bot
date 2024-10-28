const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'commands',
    execute(message) {
        const commandsEmbed = new EmbedBuilder()
            .setColor('#000000')
            .setTitle('All available commands for Knight bot')
            .setDescription([
                '`!ban [user]` - Bans a member',
                '`!kick [user]` - Kicks a member',
                '`!quiz` - Starts or stops a quiz',
                '`!clear [number of messages]` - Clears messages from a channel',
                '`!weather [city name]` - Shows current weather of a specified location',
                '`!userinfo` - Shows user information'
            ].join('\n'));

        message.channel.send({ embeds: [commandsEmbed] });
    },
};
