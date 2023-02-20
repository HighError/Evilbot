require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  ActivityType
} = require('discord.js');
const keepAlive = require('./server');

const { Guilds, GuildMembers, GuildMessages, GuildVoiceStates } =
  GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { YtDlpPlugin } = require('@distube/yt-dlp');

const { loadEvents } = require('./Handlers/eventHandler');
const { loadCommands } = require('./Handlers/commandHandler');

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, GuildVoiceStates],
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

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: false,
  emitAddSongWhenCreatingQueue: false,
  youtubeCookie: process.env.YOUTUBE_COOKIE,
  plugins: [new SpotifyPlugin(), new YtDlpPlugin({ update: true })]
});

process.on('unhandledRejection', error => {
  console.error(error);
});

module.exports = client;

keepAlive();

client.login(process.env.BOT_TOKEN).then(() => {
  loadEvents(client);
  loadCommands(client);
  client.user.setPresence({
    activities: [{ name: 'EvilBot a3.0', type: ActivityType.Playing }],
    status: 'dnd'
  });
});
