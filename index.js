const ansi = require('ansi');
const cursor = ansi(process.stdout);

const message = 'Hello, world!';

cursor.blue().bg.hex('#000000').write(message).reset().bg.reset().write('\n');
