const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'commands',
  description: 'List all available commands.',
  execute(message) {
    const commandList = [
      '!kick - Kick a member from the server.',
      '!ban - Ban a member from the server.',
      '!userinfo - Display user info.',
      '!commands - List all available commands.'
    ];

    const commandEmbed = new EmbedBuilder()
      .setColor('#000000')
      .setTitle('All Available Commands')
      .setDescription(commandList.join('\n'))
      .setTimestamp();

    message.channel.send({ embeds: [commandEmbed] });
  },
};
