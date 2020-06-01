const request = require('request');
const cheerio = require('cheerio');

const axios = require('axios');


//ЧЕРЕЗ request
// request('https://yandex.ru/pogoda/yekaterinburg/', (err, response, body) => {
//     if (!err && response.statusCode === 200) {
//         // console.log(body);
//         const $ = cheerio.load(body);

//         const weather = $('.temp__value').eq(1).text();
//         console.log(`Погода в Екатеринбурге: ${weather}.`)
//     }
// });



//ЧЕРЕЗ axios
async function getWeather() {
    try {
        const query = `https://yandex.ru/pogoda/yekaterinburg/`
        const response = await axios.get(query);
        // console.log(response);
        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const weather = $('.temp__value').eq(1).text();
            console.log(`Погода в Екатеринбурге: ${weather}.`);
        }
    } catch (err) {
        console.log(err);
    }
}

getWeather();

