const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Ban a member from the server.',
  async execute(message, args) {
    if (!message.member.permissions.has('BAN_MEMBERS')) {
      return message.reply('You don\'t have permission to ban members!');
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.reply('You need to mention a member to ban!');
    }

    if (!member.bannable) {
      return message.reply('I cannot ban this member!');
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';

    try {
      await member.ban({ reason });
      
      const banEmbed = new EmbedBuilder()
        .setColor('#000000')
        .setTitle('Member Banned')
        .setDescription(`${member.user.tag} has been banned.`)
        .addFields(
          { name: 'Banned By', value: message.author.tag },
          { name: 'User ID', value: member.id },
          { name: 'Reason', value: reason }
        )
        .setTimestamp();

      message.channel.send({ embeds: [banEmbed] });
    } catch (error) {
      console.error(error);
      message.reply('There was an error trying to ban that member.');
    }
  },
};
