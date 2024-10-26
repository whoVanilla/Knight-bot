const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'kick',
    async execute(message) {
        if (!message.member.permissions.has('KickMembers')) {
            const noPermissionEmbed = new EmbedBuilder()
                .setColor('#fc0303')
                .setDescription('You do not have permission to kick members.');
            return message.channel.send({ embeds: [noPermissionEmbed] });
        }
        
        const target = message.mentions.members.first();
        if (!target) {
            const noUserEmbed = new EmbedBuilder()
                .setColor('#ff8400')
                .setDescription('Please mention a user to kick.');
            return message.channel.send({ embeds: [noUserEmbed] });
        }

        try {
            await target.kick();
            const successEmbed = new EmbedBuilder()
                .setColor('#53c26d')
                .setDescription(`Successfully kicked ${target.user.tag}`);
            message.channel.send({ embeds: [successEmbed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#fc0303')
                .setDescription('There was an error trying to kick this user!');
            message.channel.send({ embeds: [errorEmbed] });
        }
    },
};
