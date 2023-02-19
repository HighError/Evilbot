const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guildMemberAdd',
  execute(member) {
    const { user, guild } = member;
    const welcomeChannel = guild.channels.cache.get(
      process.env.GLOBAL_CHANNEL_ID
    );
    const welcomeMessage = `Привіт <@${member.id}>`;

    const welcomeEmbed = new EmbedBuilder()
      .setTitle('**Новий учасник!**')
      .setDescription(welcomeMessage)
      .setColor(0x5620c0)
      .addFields({ name: 'Всього учасників', value: `${guild.memberCount}` })
      .setThumbnail(user.avatarURL())
      .setTimestamp();

    welcomeChannel.send({ embeds: [welcomeEmbed] });
    member.roles.add(process.env.MEMBER_ROLE);
  }
};
