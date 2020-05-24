const readLine = require('readline');
const fsPromises = require('fs').promises;

class Game {
    constructor(logFile) {
        this.logFile = logFile;
        this.rl = readLine.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        this.running = true;
    }

    async start() {
        await this.clearLog();
        console.log('Игра началась! Для выхода в любой момент введите q.')

        while (this.running) {
            try {

                const answer = await this.runRound();
                const victory = await this.onSuccess(answer);
                // console.log(victory);
                if (victory) {
                    this.running = await this.onAnswer(`Победа!`); 1
                    // console.log('+', this.running);
                } else {
                    this.running = await this.onAnswer(`Не угадал!`)
                    // console.log('-', this.running);
                }


            } catch (err) {
                this.running = this.onAnswer(`Ошибка! ${err}`);
            }
        }
        this.end();

    }
    async end() {
        this.rl.close();
        let results = await fsPromises.readFile(this.logFile, 'utf8');
        results = results.split("");
        const sum = results.reduce((a, b) => +a + +b);
        console.log(`Игра окончена. Выиграно ${sum} из ${results.length}`);
    }

    async clearLog() {
        let filehandle = null;
        try {
            filehandle = await fsPromises.open(this.logFile, 'r+');
            await filehandle.truncate(0);

        } finally {
            if (filehandle) {
                // Close the file if it is opened.
                await filehandle.close();
            }
        }
    }

    async onSuccess(answer) {
        const result = Math.round(Math.random()) + 1
        if (+answer === result) {
            await this.writeLog('1');
            return true;
        } else {
            await this.writeLog('0');
            return false;
        }

    }

    onAnswer(text) {
        return new Promise((resolve, reject) => {
            this.rl.question(`${text} \nХотите сыграть еще?\n 1 - Да\n Любое иное - Нет\n`, (answer) => {
                if (answer === '1') {
                    if (answer === '1') resolve(true);
                } else {
                    resolve(false);
                }
            })
        })
    }

    runRound() {
        return new Promise((resolve, reject) => {
            this.rl.question(`Орел или решка?\n 1 - Орел\n 2 - Решка\n`, (answer) => {
                if (answer === '1' || answer === '2') {
                    resolve(answer);
                } else {
                    reject(`Ошибочное значение: ${answer}`);
                }

            });
        })
    }



    async writeLog(data) {
        await fsPromises.appendFile(this.logFile, data, 'utf8');
    }
}

const logFile = './hw2-game/log.txt'
const game = new Game(logFile);
game.start();