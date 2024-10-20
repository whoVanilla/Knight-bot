const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'userinfo',
  description: 'Display user info.',
  async execute(message) {
    const member = message.mentions.members.first() || message.member;

    const roles = member.roles.cache
      .filter(role => role.id !== message.guild.id)
      .map(role => `<@&${role.id}>`)
      .join(', ') || 'No roles'; 

    const userInfoEmbed = new EmbedBuilder()
      .setColor('#000000')
      .setTitle(`User Info for ${member.user.tag}`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .addFields(
        { name: 'User ID', value: member.user.id, inline: true },
        { name: 'Account Created', value: member.user.createdAt.toDateString(), inline: true },
        { name: 'Joined Server', value: member.joinedAt.toDateString(), inline: true },
        { name: 'Nickname', value: member.displayName, inline: true },
        { name: 'Roles', value: roles, inline: false }
      )
      .setTimestamp();

    message.channel.send({ embeds: [userInfoEmbed] });
  },
};
