const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const moment = require('moment');
const { getData } = require('../../apis/uadataNet');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('war')
    .setDescription('Losses of the russian army in the hot phase of the war'),
  async execute(interaction) {
    const data = await getData();
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Детальніше')
        .setURL(`https://uadata.net/vtraty-rf:people.data`)
        .setStyle(ButtonStyle.Link)
    );
    return interaction.reply({
      embeds: [formatData(data)],
      ephemeral: false,
      components: [row]
    });
  }
};

function formatData(data) {
  const embed = new EmbedBuilder({
    title: `Втрати русні за період війни`,
    color: 0x5620c0,
    author: {
      name: 'UAdata',
      url: 'https://uadata.net/',
      icon_url: 'https://avatars.githubusercontent.com/uadata'
    }
  });

  embed.setTimestamp();

  data.forEach(e => {
    embed.addFields({
      name: e.title,
      value: `${e.val}`,
      inline: true
    });
  });

  embed.addFields({
    name: 'Днів війни',
    value: `${Math.floor(
      (moment() - moment('2022-02-24')) / 1000 / 60 / 60 / 24
    )}`,
    inline: true
  });

  return embed;
}
