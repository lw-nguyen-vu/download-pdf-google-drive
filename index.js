const fs = require('fs');
const path = require('path');
const axios = require('axios');

const START_PAGE = 0;
const END_PAGE = 143;

const getURLImage = (page) => {
  // https://drive.google.com/viewer2/.................
  return `https://drive.google.com/viewer2/prod-03/img?ck=drive&ds=APznzaZIJTMUWoAv_l3stU8ba6V5G_tt7Avm2DQNDXw0yyjRDqRSMofDW0qIwIXRl5M71y8M6tYb1vVlgOs-5aOadsTzq-IEi0i2eL_u0ibPSh_-NBR1VRiqek90AiK9tOO84ks-5zjQ0a_-yK22-3DtDVeVWvAxj5kcPSm-GKPdQ-fxZo8WNSdObgRW__rx6s9rla9iUXdxvGD1dog4wJjg232YDkPmlD8OJqA8J2143NaVBRlm-V-2ZBr2L_tmWWTHmY2IR-wPvwNVwuOim6MBfZkXlL8tyxfRcOUPQEqqG5KOtYQgKuZNtp7LXqe3Ny2s81YngbuzF1xT4lGL_PoR2aJIHcz-ZtD6jmutKGQ1NK_HWMS4WLhChyNBdVZss8LKvlNPK6xr&authuser=0&page=${page}&skiphighlight=true&w=1600&webp=true`;
};

async function downloadImage(url, page) {
  const stream = path.resolve(__dirname, 'images', `${page + 1}.jpg`);
  const writer = fs.createWriteStream(stream);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      resolve();
      console.log(`✅ Done: Page ${page + 1}`);
    });
    writer.on('error', () => {
      reject();
      console.log(` Error`);
    });
  });
}

const run = async () => {
  for (let i = START_PAGE; i < END_PAGE; i++) {
    const url = getURLImage(i);
    await downloadImage(url, i);
  }
};

run();
