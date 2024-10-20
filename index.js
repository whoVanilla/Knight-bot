require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('ready', () => {
  console.log('Bot is online!');

    // Rich presence
  client.user.setPresence({
    activities: [{ name: 'Vanilla', type: 2 }],
    status: 'dnd' 
  });
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  // Kick 
  if (message.content.startsWith('!kick')) {
    if (!message.member.permissions.has('KICK_MEMBERS')) {
      return message.reply('You don\'t have permission to kick members!');
    }
    const member = message.mentions.members.first();
    if (member) {
      await member.kick();
      
      // Embed
      const kickEmbed = new EmbedBuilder()
        .setColor('#000000') 
        .setTitle('Member Kicked Successfully!')
        .setDescription(`${member.user.tag} has been kicked!`)
        .addFields(
          { name: 'Kicked By', value: message.author.tag },
          { name: 'User ID', value: member.id }
        )
        .setTimestamp();

      message.channel.send({ embeds: [kickEmbed] });
    } else {
      message.channel.send('You need to mention a member!');
    }
  }

  // Ban 
  if (message.content.startsWith('!ban')) {
    if (!message.member.permissions.has('BAN_MEMBERS')) {
      return message.reply('You don\'t have permission to ban members!');
    }
    const member = message.mentions.members.first();
    if (member) {
      await member.ban();
      
      // Embed
      const banEmbed = new EmbedBuilder()
        .setColor('#000000')
        .setTitle('Member Banned Successfully!')
        .setDescription(`${member.user.tag} has been banned!`)
        .addFields(
          { name: 'Banned By', value: message.author.tag },
          { name: 'User ID', value: member.id }
        )
        .setTimestamp();

      message.channel.send({ embeds: [banEmbed] });
    } else {
      message.channel.send('You need to mention a member!');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
