const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'kick',
  description: 'Kick a member from the server.',
  async execute(message, args) {
    if (!message.member.permissions.has('KICK_MEMBERS')) {
      return message.reply('You don\'t have permission to kick members!');
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.reply('You need to mention a member to kick!');
    }

    if (!member.kickable) {
      return message.reply('I cannot kick this member!');
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';

    try {
      await member.kick(reason);
      
      const kickEmbed = new EmbedBuilder()
        .setColor('#000000')
        .setTitle('Member Kicked')
        .setDescription(`${member.user.tag} has been kicked.`)
        .addFields(
          { name: 'Kicked By', value: message.author.tag },
          { name: 'User ID', value: member.id },
          { name: 'Reason', value: reason }
        )
        .setTimestamp();

      message.channel.send({ embeds: [kickEmbed] });
    } catch (error) {
      console.error(error);
      message.reply('There was an error trying to kick that member.');
    }
  },
};
