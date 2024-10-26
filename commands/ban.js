const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ban',
    async execute(message) {
        if (!message.member.permissions.has('BanMembers')) {
            const noPermissionEmbed = new EmbedBuilder()
                .setColor('#fc0303')
                .setDescription('You do not have permission to ban members.');
            return message.channel.send({ embeds: [noPermissionEmbed] });
        }
        
        const target = message.mentions.members.first();
        if (!target) {
            const noUserEmbed = new EmbedBuilder()
                .setColor('#ff8400')
                .setDescription('Please mention a user to ban.');
            return message.channel.send({ embeds: [noUserEmbed] });
        }

        try {
            await target.ban();
            const successEmbed = new EmbedBuilder()
                .setColor('#53c26d')
                .setDescription(`Successfully banned ${target.user.tag}`);
            message.channel.send({ embeds: [successEmbed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#fc0303')
                .setDescription('There was an error trying to ban this user.');
            message.channel.send({ embeds: [errorEmbed] });
        }
    },
};
