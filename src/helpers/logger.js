
const chalk = require('chalk')

const logger = {

    log: function (text) {
        if(!text) text = '';
        console.log(`${chalk.cyan('[+]')} ${chalk.white(getStringed(text))}`);
    },

    warn: function (text) {
        if(!text) text = '';
        console.log(`${chalk.yellow('[~]')} ${chalk.white(getStringed(text))}`);
    },

    error: function (text) {
        if(!text) text = '';
        console.log(`${chalk.red('[!]')} ${chalk.white(getStringed(text))}`);
    },

    clear: function () {
        console.log('\033[2J');
    }, 

    nl : function() {
        console.log('');
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