const fs = require('fs');
const path = require('path');
const axios = require('axios');

const START_PAGE = 0;
const END_PAGE = 143;

const getURLImage = (page) => {
  // https://drive.google.com/viewer2/.................
  return `https://drive.google.com/viewer2/prod-03/img?ck=drive&ds=APznzabC8bFIK9vHuZdEC8SXeewD46oASpqTzrxEU9tyYKWrZURFEYit8mTQ_h1-bQVe9dycrenoGT4yQ398ANU6WG5uk0tAaBo47Q7jpvPiG_ksvI23RLfk3Pe4RKQELtmPEc5QKqPdiFUFw5cJIwPjMhOKRx2thK8xYTKpxqzOvmHu9cNetWxxkLqoUyooU0jst-32Tn0C44sWt-G_GAQxitaUp-tcLVFkowCcIx3M-Dli6yP6evOwLwsylsqHA-uGKV6q0smmIHpgUpkl9zeAYh1M1ysBuAE46zfGlb0ZHA6X5tl3XG99VykXEv_zKgPXAxUUolvansXjvpsKTB7n57pE5PY6d3Q4h84z_w6yes9-KbPH8BZU1P8oWx30DGrmLLF6htQz&authuser=0&page=${page}&skiphighlight=true&w=1600&webp=true`;
};

async function downloadImage(number) {
  const page = number + 1;
  const imagePath = path.resolve(__dirname, 'images', `${page}.jpg`);
  const writer = fs.createWriteStream(imagePath);

  const url = getURLImage(number);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      resolve();
      console.log(`✅ Done: Page ${page}`);
    });
    writer.on('error', () => {
      reject();
      console.log(`❌ Error`);
    });
  });
}

const run = async () => {
  for (let i = START_PAGE; i < END_PAGE; i++) {
    await downloadImage(i);
  }
};

run();
