const fs = require('fs');
const path = require('path');
const axios = require('axios');
const imgToPDF = require('image-to-pdf');

const FILE_NAME = 'CRYPTO DECADE';
const START_PAGE = 0;
const END_PAGE = 143;

const getURLImage = (page) => {
  return `https://drive.google.com/viewer2/prod-03/img?ck=drive&ds=APznzaZnVVcaDA4bkRVuFvF4j1xw79ST5ak-xbtCIDENnDyuxgFtnv0ODiNvfvhn08A5el6rqFb28b9kF4OQT5YPnEmPUhgC9zHuE3hqIjCHHmOhZPHzPJvcnrWM1aFmGoZsDMSk2FMOMv3y6Srj4oE3y59qmwBAbkI8fdT74H76MmGYkGZRXM_yd8tC-VBapumi0_sJmO3zdWo9i0uOx--yeRd4_DzsY1gF5Giw2NcWw_U5zUX3H5BeOozZGJZtx9e4i9r1y3yOsZwokkmdd-13TAiSwLclgfz4rNnkXTkpilwz-ymSkUuIigV3IvN6q5vFpbX9ZpUitcKliBXwK1hOYs2KquV63MCl7dnBlvykgjQgd9kxkO8RFuc9kSYkyunKnYrxJO36&authuser=0&page=${page}&skiphighlight=true&w=1600&webp=true`;
};

const downloadImage = async (number) => {
  const page = number + 1;
  const imagePath = path.resolve(__dirname, 'images', `${page}.jpg`);
  const writer = fs.createWriteStream(imagePath);

  const url = getURLImage(number);

  const { data } = await axios({
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
