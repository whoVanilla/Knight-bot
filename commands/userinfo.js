const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'userinfo',
    execute(message) {
        const target = message.mentions.users.first() || message.author;
        const member = message.guild.members.cache.get(target.id);

        const roles = member.roles.cache
            .filter(role => role.id !== message.guild.id)
            .map(role => `<@&${role.id}>`)
            .join(', ') || 'None';

        const userInfoEmbed = new EmbedBuilder()
            .setColor('#ab7aff')
            .setTitle(`${target.tag}'s Info`)
            .setThumbnail(target.displayAvatarURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: 'Username', value: target.tag, inline: true },
                { name: 'User ID', value: target.id, inline: true },
                { name: 'Account Created', value: target.createdAt.toDateString(), inline: true },
                { name: 'Joined Server', value: member.joinedAt.toDateString(), inline: true },
                { name: 'Roles', value: roles }
            );

        message.channel.send({ embeds: [userInfoEmbed] });
    },
};
