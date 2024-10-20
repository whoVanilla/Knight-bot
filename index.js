require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const commands = new Map();

const loadCommands = (dir) => {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);

    if (stat.isDirectory()) {
      loadCommands(filepath);
    } else if (file.endsWith('.js')) {
      const command = require(filepath);
      commands.set(command.name, command);
    }
  }
};

loadCommands(path.join(__dirname, 'commands'));

client.once('ready', () => {
  console.log('Bot is online!');

  client.user.setPresence({
    activities: [{
      name: 'Vanilla',
      type: 2,
    }],
    status: 'dnd'
  });
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (commands.has(commandName)) {
    const command = commands.get(commandName);
    command.execute(message, args);
  }
});

client.login(process.env.DISCORD_TOKEN);
