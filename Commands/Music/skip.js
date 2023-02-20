const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const client = require('../../index');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip a track and go to the next one'),
  async execute(interaction) {
    const { member, guild } = interaction;

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
      if (!queue.autoplay && queue.songs.length <= 1) {
        await queue.stop(voiceChannel);
        embed
          .setColor(0x5620c0)
          .setDescription(
            '⏹️ Більше пісень не знайдено, програвання зупинено.'
          );
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }
      await queue.skip(voiceChannel);
      embed.setColor(0x5620c0).setDescription('⏭️ Ця пісня була пропущена.');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
      console.log(err);
      embed.setColor('Red').setDescription('⛔ Щось пішло не так...');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
};
