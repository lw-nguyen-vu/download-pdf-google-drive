const fs = require('fs');
const path = require('path');
const axios = require('axios');
const imgToPDF = require('image-to-pdf');

const FILE_NAME = 'PCCC&TAHK';
const START_PAGE = 0;
const END_PAGE = 532;
const COOKIE = '';

const getURLImage = (page) => {
  return `https://drive.google.com/viewer2/prod-01/img?ck=drive&ds=APznzaY1X8PRbtsCJdesneO5noZGlQQrceLOJvNiXxMvFTTxFXUUhelxyVVviURhtoBnLbooQneF-juZAf0ZevDjcGT2jC1BaEIJWoC7rRt0aWtkzrC40VqzDvfRxhYlH4dy7dSlIJLjs9kbRQ-dzmEO3qKdBfsmzKlRE1KWycD_skmORpbf9DHga-38_o8fQaXzXtzhagqHiN_-0-G2Eh0wBhFMWLOhwzHKWSfRIHqx3-o0neMrrrJWiXmssDqf_l5Zc4-c5yb6IoQ-fQR9jYn9r9OTBIjYWHx4VYE7pwqd_4P-jd5Wddz8DBXpuFShGsfFm8Cu50_g6dxPTQ67TYVw6KtwftvJ1fs_OGo7mXG4Qh1eN6qGM3WIOg6OF_hCFmrnht5tvvRZyaeGWoj0t4zPXDBcUXMPcQ%3D%3D&authuser=0&page=${page}&skiphighlight=true&w=1600&webp=true`;
};

const downloadImage = async (number) => {
  const page = number + 1;
  const imagePath = path.resolve(__dirname, 'images', `${page}.jpg`);
  const writer = fs.createWriteStream(imagePath);

  const url = getURLImage(number);

  const { data } = await axios({
    headers: { cookie: COOKIE },
    url,
    method: 'GET',
    responseType: 'stream',
  });

  data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      resolve(`./images/${page}.jpg`);
      console.log(`✅ Done: Page ${page}`);
    });
    writer.on('error', () => {
      reject();
      console.log(`❌ Error`);
    });
  });
};

const run = async () => {
  const pages = [];

  for (let i = START_PAGE; i < END_PAGE; i++) {
    pages.push(await downloadImage(i));
  }

  imgToPDF(pages, imgToPDF.sizes.A4).pipe(fs.createWriteStream(`${FILE_NAME}.pdf`));

  const dir = './images';
  fs.readdirSync(dir).forEach((f) => fs.rmSync(`${dir}/${f}`));
};

run();
