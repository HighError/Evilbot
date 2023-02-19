require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  ActivityType
} = require('discord.js');
const keepAlive = require('./server');

const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const { loadEvents } = require('./Handlers/eventHandler');
const { loadCommands } = require('./Handlers/commandHandler');

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages],
  partials: [User, Message, GuildMember, ThreadMember]
});

client.commands = new Collection();

client.on('interactionCreate', interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    interaction.reply({ content: "there isn't a command like that" });
  }

  command.execute(interaction, client);
});

keepAlive();

client.login(process.env.BOT_TOKEN).then(() => {
  loadEvents(client);
  loadCommands(client);
  client.user.setPresence({
    activities: [{ name: 'EvilBot a3.0', type: ActivityType.Playing }],
    status: 'dnd'
  });
});
