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
    console.log(`The bot is up and running!`);
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
