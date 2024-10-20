require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

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
      message.channel.send(`${member.user.tag} has been kicked.`);
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
      message.channel.send(`${member.user.tag} has been banned.`);
    } else {
      message.channel.send('You need to mention a member!');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
