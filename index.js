const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, EmbedBuilder, ActivityType } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if (command.name && typeof command.execute === 'function') {
        client.commands.set(command.name, command);
    } else {
        console.warn(`The command at ${filePath} is missing a required "name" or "execute" property.`);
    }
}

client.once('ready', () => {
    console.log(`\x1b[1m\x1b[96mThe bot is up and running!`);
    client.user.setActivity('Vanilla', { type: ActivityType.Listening });
});

client.on('messageCreate', message => {
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    if (!command) return;

    try {
        command.execute(message, args);
        console.log(`\x1b[33m${message.author.username}\x1b[0m executed the \x1b[1m\x1b[91m!${command.name}\x1b[0m command in \x1b[36m${message.guild.name}\x1b[0m.`);
    } catch (error) {
        console.error(`Error executing command ${commandName}:`, error);
        const errorEmbed = new EmbedBuilder()
            .setTitle("Error")
            .setDescription("There was an error trying to execute that command!")
            .setColor('#fc0303');
        message.channel.send({ embeds: [errorEmbed] });
    }
});

client.login(process.env.TOKEN);
