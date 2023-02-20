const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const client = require('../../index');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Adjust the song volume')
    .addIntegerOption(option =>
      option
        .setName('percent')
        .setDescription('Percent')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    ),
  async execute(interaction) {
    const { options, member, guild } = interaction;

    const volume = options.getInteger('percent');
    const voiceChannel = member.voice.channel;
    const queue = await client.distube.getQueue(voiceChannel);

    const embed = new EmbedBuilder();

    if (!voiceChannel) {
      embed
        .setColor('Red')
        .setDescription(
          '⛔ Ти повинен знаходитись в голосовому каналі, щоб використовувати ці команди.'
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!member.voice.channelId == guild.members.me.voice.channelId) {
      embed
        .setColor('Red')
        .setDescription(
          `⛔ Бот вже використовується в каналі <#${guild.members.me.voice.channelId}>.`
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!queue) {
      embed.setColor('Red').setDescription(`⏹️ Наразі черга пуста.`);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      client.distube.setVolume(voiceChannel, volume);
      embed
        .setColor('0x5620c0')
        .setDescription(`🔊 Гучність змінена на ${volume}%.`);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
      console.log(err);
      embed.setColor('Red').setDescription('⛔ Щось пішло не так...');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
};
