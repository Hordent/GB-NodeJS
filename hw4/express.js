const express = require('express');
// const path = require('path');
// const consolidate = require('consolidate'); // для работы с шаблонизаторами
const cheerio = require('cheerio');
const axios = require('axios');
const cookieParser = require('cookie-parser');
 


const app = express();

// Настройка handlebars
// app.engine('hbs', consolidate.handlebars);
// app.set('view engine', 'hbs');
// app.set('views', path.resolve(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

async function getWeather(qName) {
    try {
        const query = `https://yandex.ru/pogoda/${qName}`
        const response = await axios.get(query);
        // console.log(response);
        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            return weather = $('.temp__value').eq(1).text();

        }
    } catch (err) {
        console.log(err);
    }
}

const template = ({ cityId, cityName, weather }) => {

    return `<div class="info">
        <form method="POST" action="/">
            <h3><b>Выберите город для показа погоды</b></h3>
            <p><input name="city" type="radio" value="0" ${(cityId === 0) ? `checked` : ''}>Москва</p>
            <p><input name="city" type="radio" value="1" ${(cityId === 1) ? `checked` : ''}>Санкт-Петербург</p>
            <p><input name="city" type="radio" value="2" ${(cityId === 2) ? `checked` : ''}>Екатерингург</p>
            <p><input type="submit" value="Выбрать"></p>
        </form>
    
        <h3>Погода в ${cityName}: ${weather}</h3>
      
    </div>`

}

const cities = [
    {
        name: "Москве",
        qName: "213"
    },
    {
        name: "Санкт-Петербурге",
        qName: "2"
    },
    {
        name: "Екатеринбурге",
        qName: "yekaterinburg"
    }
]

app.get('/', async (req, res) => {
    let cityId, city, weather;
    console.log(req.cookies);
    if (req.cookies) {
        if (req.cookies.city) {
            cityId = +req.cookies.city;
            city = cities[cityId];
            weather = await getWeather(city.qName);
        }
    }
    if (!cityId) {
        cityId = 0;
        city = cities[cityId];
        weather = await getWeather(city.qName);
    }

    res.send(template({
        cityName: city.name,
        weather: weather,
        cityId: cityId
    }))
})

app.post('/', async (req, res) => {


    const cityId = +req.body.city;
    const city = cities[cityId];
    const weather = await getWeather(city.qName);
    res.cookie('city', cityId, { path: '/', maxAge: 90000 });
    res.send(template({
        cityName: city.name,
        weather: weather,
        cityId: cityId
    }))
})

app.listen(8888, () => {
    console.log('Server has been started!');
})