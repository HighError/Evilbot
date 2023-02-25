const client = require('../../index.js');
const { EmbedBuilder } = require('discord.js');

const status = queue =>
  `Гучність: \`${queue.volume}%\` | Фільтр: \`${
    queue.filters.names.join(', ') || 'Off'
  }\` | Зациклення: \`${
    queue.repeatMode
      ? queue.repeatMode === 2
        ? 'Весь список'
        : 'Пісня'
      : 'Вимкнено'
  }\` | Авто: \`${queue.autoplay ? 'Увімкнено' : 'Вимкнено'}\``;

client.distube
  .on('playSong', (queue, song) =>
    queue.textChannel.send({
      embeds: [
        new EmbedBuilder()
          .setColor('0x5620c0')
          .setDescription(
            `🎶 | Відтворення \`${song.name}\` - \`${
              song.formattedDuration
            }\`\nНа запит: ${song.user}\n${status(queue)}`
          )
      ]
    })
  )
  .on('addSong', (queue, song) =>
    queue.textChannel.send({
      embeds: [
        new EmbedBuilder()
          .setColor('0x5620c0')
          .setDescription(
            `🎶 | ${song.user} додав у чергу ${song.name} - \`${song.formattedDuration}\``
          )
      ]
    })
  )
  .on('addList', (queue, playlist) =>
    queue.textChannel.send({
      embeds: [
        new EmbedBuilder()
          .setColor('0x5620c0')
          .setDescription(
            `🎶 | Додано список відтворення \`${playlist.name}\` (${
              playlist.songs.length
            } пісень) до черги\n${status(queue)}`
          )
      ]
    })
  )
  .on('error', (channel, e) => {
    if (channel)
      channel.send(`⛔ | Сталася помилка: ${e.toString().slice(0, 1974)}`);
    else console.error(e);
  })
  .on('empty', channel =>
    channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor('Red')
          .setDescription('⛔ | Голосовий канал порожній! Залишаю канал...')
      ]
    })
  )
  .on('searchNoResult', message =>
    message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor('Red')
          .setDescription('`⛔ | Не знайдено результатів для `${query}`!`')
      ]
    })
  )
  .on('finish', queue =>
    queue.textChannel.send({
      embeds: [
        new EmbedBuilder()
          .setColor('0x5620c0')
          .setDescription('🏁 | Черга завершена!')
      ]
    })
  );
