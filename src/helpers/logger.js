var logFileLocation = null;
var logFile = false;

const fs = require('fs');
const chalk = require('chalk');
const moment = require('moment');

const logger = {

    logFile: function() {
        if(typeof logFileLocation != 'string') return false;
        return fs.readFileSync(logFileLocation).toString();
    },

    logData: function(path) {
        if(!fs.existsSync(path)) return this.error(`Path '${path}' isn't valid.`);
        logFileLocation = path;
        logFile = true;
    },

    newLog: function() {
        fs.writeFileSync(logFileLocation, `[*] Started log file (${moment().format('MMMM Do YYYY, h:mm:ss a')})\n`);
    },

    log: function (text) {
        if(!text) text = '';
        console.log(`${chalk.cyan('[+]')} ${chalk.white(getStringed(text))}`);
        writeToLog(`[info | ${moment().format("MM-DD / h:mm:ss")}]: ${getStringed(text)}`);
    },

    warn: function (text) {
        if(!text) text = '';
        console.log(`${chalk.yellow('[~]')} ${chalk.white(getStringed(text))}`);
        writeToLog(`[warn | ${moment().format("MM-DD / h:mm:ss")}]: ${getStringed(text)}`);
    },

    error: function (text) {
        if(!text) text = '';
        console.log(`${chalk.red('[!]')} ${chalk.white(getStringed(text))}`);
        writeToLog(`[errr | ${moment().format("MM-DD / h:mm:ss")}]: ${getStringed(text)}`);
    },

    clear: function () {
        console.log('\033[2J');
    }, 

    nl : function() {
        console.log('');
    }

}

function writeToLog(text) {
    if(logFile) {
        if(!fs.existsSync(logFileLocation)) { logFileLocation = null; return this.error(`Path '${path}' isn't valid`); }
        fs.appendFileSync(logFileLocation, `\n${text}`);
    }
}

function getStringed(input) {
    switch (typeof input) {
        
        case 'boolean':
            return input ? 'true' : 'false';
        break;
        
        case 'function':
            return `[function]`;
        break;

        case undefined:
            return `[undefined]`;
        break;

        default:
            return input.toString();
        break;
    }
}

module.exports = logger;