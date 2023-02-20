const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const client = require('../../index');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('music')
    .setDescription('Complete music system.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('play')
        .setDescription('Play a song.')
        .addStringOption(option =>
          option
            .setName('query')
            .setDescription('Provide the name or url for the song.')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('volume')
        .setDescription('Adjust the song volume.')
        .addIntegerOption(option =>
          option
            .setName('percent')
            .setDescription('Percent')
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('options')
        .setDescription('Select an option.')
        .addStringOption(option =>
          option
            .setName('options')
            .setDescription('Select an options.')
            .setRequired(true)
            .addChoices(
              { name: 'queue', value: 'queue' },
              { name: 'skip', value: 'skip' },
              { name: 'pause', value: 'pause' },
              { name: 'resume', value: 'resume' },
              { name: 'stop', value: 'stop' }
            )
        )
    ),
  async execute(interaction) {
    const { options, member, guild, channel } = interaction;

    const subcommand = options.getSubcommand();
    const query = options.getString('query');
    const volume = options.getInteger('percent');
    const option = options.getString('options');
    const voiceChannel = member.voice.channel;

    const embed = new EmbedBuilder();

    if (!voiceChannel) {
      embed
        .setColor('Red')
        .setDescription(
          'Ти повинен знаходитись в голосовому каналі, щоб використовувати ці команди.'
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!member.voice.channelId == guild.members.me.voice.channelId) {
      embed
        .setColor('Red')
        .setDescription(
          `Бот вже використовується в каналі <#${guild.members.me.voice.channelId}>.`
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      switch (subcommand) {
        case 'play':
          client.distube.play(voiceChannel, query, {
            textChannel: channel,
            member: member
          });
          return interaction.reply({
            content: '🎶 Запит отримано.',
            ephemeral: true
          });
        case 'volume':
          client.distube.setVolume(voiceChannel, volume);
          return interaction.reply({
            content: `🔊 Гучність змінена на ${volume}%.`,
            ephemeral: true
          });
        case 'options': {
          const queue = await client.distube.getQueue(voiceChannel);

          if (!queue) {
            embed.setColor('Red').setDescription(`Наразі черга пуста.`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
          }

          switch (option) {
            case 'skip':
              if (!queue.autoplay && queue.songs.lenght <= 1) {
                embed
                  .setColor('Red')
                  .setDescription('⛔ Список відтворення пустий!');
                return interaction.reply({ embeds: [embed], ephemeral: true });
              } else {
                await queue.skip(voiceChannel);
                embed
                  .setColor(0x5620c0)
                  .setDescription('⏭️ Ця пісня була пропущена.');
                return interaction.reply({ embeds: [embed], ephemeral: true });
              }
            case 'stop':
              await queue.stop(voiceChannel);
              embed.setColor(0x5620c0).setDescription('⏭️ Черга зупинена.');
              return interaction.reply({ embeds: [embed], ephemeral: true });
            case 'pause':
              await queue.pause(voiceChannel);
              embed.setColor(0x5620c0).setDescription('⏸️ Пісню призупинено.');
              return interaction.reply({ embeds: [embed], ephemeral: true });
            case 'resume':
              await queue.resume(voiceChannel);
              embed.setColor(0x5620c0).setDescription('▶️ Пісню відновлено.');
              return interaction.reply({ embeds: [embed], ephemeral: true });
            case 'queue': {
              embed.setColor('Red').setDescription(`Наразі черга не пуста.`);
              const data = `${queue.songs.map(
                (song, id) =>
                  `\n**${id + 1}. ** ${song.name} -\`${
                    song.formattedDuration
                  }\``
              )}`;
              embed.setColor(0x5620c0).setDescription(data);
              return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            default:
              embed.setColor('Red').setDescription('???');
              return interaction.reply({ embeds: [embed], ephemeral: true });
          }
        }
        default:
          embed.setColor('Red').setDescription('?');
          return interaction.reply({ embeds: [embed], ephemeral: true });
      }
    } catch (err) {
      console.log(err);
      embed.setColor('Red').setDescription('⛔ Щось пішло не так...');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
};
