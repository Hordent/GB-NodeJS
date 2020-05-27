const http = require('http');
const url = require('url');
const axios = require('axios');

const input = (value) => {

    return `<form action="/translate">
                    <p><b>Введите русский текст для перевода</b></p>
                    <p><input type="textfield" name="text" value="${value}"></p>
                    <p><input type="submit"></p>
                </form>`
}
async function translate(text) {
    try {
        const query = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200526T184034Z.bd961a46a094434d.8a4a51f9116071444b771644709d085404edf7dd&text=${encodeURIComponent(text)}&lang=ru-en`

        const response = await axios.get(query);

        return response.data.text[0];
    } catch (err) {
        console.log(err);
    }    
}


http.createServer(async (request, response) => {

    const params = url.parse(request.url, true);

    if (params.pathname === '/translate') {
        response.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
        });
        const traslatedText = await translate(params.query.text);
        console.log(traslatedText);
        response.write(input(params.query.text));
        response.write(`<p><b>Перевод:</b></p>`);
        response.write(`<p>${traslatedText}</p>`);
        response.end();
    } else if (params.pathname === '/') {
        response.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
        });
        response.write(input(""));
        response.end();
    } else {
        response.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8',
        });
        response.write('Неверный запрос!');
        response.end();
    }
}).listen(80, '0.0.0.0');