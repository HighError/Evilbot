const Axios = require('axios');
const { setupCache } = require('axios-cache-interceptor');

const axios = setupCache(Axios);

exports.getData = async function () {
  const data = [
    {
      title: 'Особовий склад',
      val:
        (await GetDataFromLastDate(
          'https://uadata.net/ukraine-russia-war-2022/people.json'
        )) ?? null
    },
    {
      title: 'Бойові машини',
      val:
        (await GetDataFromLastDate(
          'https://uadata.net/ukraine-russia-war-2022/bbm.json'
        )) ?? null
    },
    {
      title: 'Літаки',
      val:
        (await GetDataFromLastDate(
          'https://uadata.net/ukraine-russia-war-2022/planes.json'
        )) ?? null
    },
    {
      title: 'Танки',
      val:
        (await GetDataFromLastDate(
          'https://uadata.net/ukraine-russia-war-2022/tanks.json'
        )) ?? null
    },
    {
      title: 'Артилерійські системи',
      val:
        (await GetDataFromLastDate(
          'https://uadata.net/ukraine-russia-war-2022/artilery.json'
        )) ?? null
    },
    {
      title: 'РСЗВ',
      val:
        (await GetDataFromLastDate(
          'https://uadata.net/ukraine-russia-war-2022/rszv.json'
        )) ?? null
    },
    {
      title: 'ППО',
      val:
        (await GetDataFromLastDate(
          'https://uadata.net/ukraine-russia-war-2022/ppo.json'
        )) ?? null
    },
    {
      title: 'Гелікоптери',
      val:
        (await GetDataFromLastDate(
          'https://uadata.net/ukraine-russia-war-2022/helicopters.json'
        )) ?? null
    },
    {
      title: 'Автомобільна техніка',
      val:
        (await GetDataFromLastDate(
          'https://uadata.net/ukraine-russia-war-2022/auto.json'
        )) ?? null
    },
    {
      title: 'Кораблі',
      val:
        (await GetDataFromLastDate(
          'https://uadata.net/ukraine-russia-war-2022/ships.json'
        )) ?? null
    },
    {
      title: 'БПЛА',
      val:
        (await GetDataFromLastDate(
          'https://uadata.net/ukraine-russia-war-2022/bpla.json'
        )) ?? null
    }
  ];
  return data;
};

async function GetDataFromLastDate(path) {
  if (!path) {
    return null;
  }
  try {
    const response = await axios.get(path);
    if (!response || !response.data || !response.data.data) {
      return null;
    }
    const filtered = response.data.data.at(-1);
    return filtered?.val ?? null;
  } catch (err) {
    console.log(err);
    return null;
  }
}
