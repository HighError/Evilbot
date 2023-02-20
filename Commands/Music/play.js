const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const client = require('../../index');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Add track to queue')
    .addStringOption(option =>
      option
        .setName('track')
        .setDescription('Provide the name or url for the song.')
        .setRequired(true)
    ),
  async execute(interaction) {
    const { options, member, guild, channel } = interaction;

    const track = options.getString('track');
    const voiceChannel = member.voice.channel;

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

    try {
      client.distube.play(voiceChannel, track, {
        textChannel: channel,
        member: member
      });
      embed.setColor(0x5620c0).setDescription(`🎶 Запит отримано. Обробляю...`);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
      console.log(err);
      embed.setColor('Red').setDescription('⛔ Щось пішло не так...');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
};
