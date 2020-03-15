#!/usr/bin/env node

/** Prerequisites */

const db = require('quick.db');
const args = process.argv.slice(2);
const commands = require('./data/commands.json');
const exec = require('child_process').exec;
const uuid = require('uuid').v1;

/** Helpers **/

const command_builder = require('./helpers/command-builder');
const logger = require('./helpers/logger');
const extras = require('./helpers/extras');
const color = require('./helpers/color');

/** Set LogFile Location **/
logger.logData('./data/log.log');

/** Running Commands **/
if(args.length == 0) args[0] = 'help';

var command = args.shift().toLowerCase();

const connected = db.has('connection') ? db.get('connection') : false;
const light = db.has('light') ? db.get('light') : null;

switch(command) {

    case "help":
        logger.log(
            `:)
        tradfri-node-interface [tradni]
        Interface with your tradfri lights!

            Usage: tradni <command> [arguments]
            Key: <mandatory> [optional]
                        
            commands: 
            ${commands.map(c => `   ${c.usage} - ${c.short}`).join('\n            ')}`
        );
    break;

    case "gateway":

        if(args.length != 2) return logger.error('Please provide the gateway IP and security code.');

        var cb = new command_builder(`${__dirname}/lib/coap-client`, args[1], args[0]);

        (async() => {

            const identity = uuid().replace(/-/g, '');
            const command = cb.createNewDTLSIdentity(identity);
            const result = await cbexec(command);

            const preSharedKey = result['9091'];
            logger.log(`For future use:\n    Identity: '${identity}'\n    PSK: '${preSharedKey}'`);
            
            db.set('gateway', {ip: args[0], identity: identity, psk: preSharedKey});
            logger.log('Identity and PSK stored.');

        })();

    break;

    case "select":
        if(!connected || !db.has('lights')) return logger.error('The tradni server isn\'t running, or hasn\'t found any lights.');
        if(args.length != 1 || isNaN(args[0])) return logger.error('Please provide a light number to select.');

        var lights = db.get('lights');

        for(var i in lights) {
            if(lights[i].instanceId == args[0]) {
                db.set('light', lights[i].instanceId);
                db.set('pulse', '#ff006a')
                return logger.log(`Set light ${lights[i].instanceId} ('${lights[i].name}') to the active light.`);
            }
        }

        return logger.error('No light found with that id.\n    Use \'tradni list\' to list all connected devices.');

    break;

    case "list":
        if(!connected || !db.has('lights')) return logger.error('The tradni server isn\'t running, or hasn\'t found any lights.');
        
        var output = "";

        var lights = db.get('lights');
        for(var i in lights) { output += `      ${lights[i].instanceId}) ${lights[i].name}` };

        logger.log(`Avaliable Lights (${output.split('\n').length} in total):\n${output}`);

    break;

    case "on":
        if(!connected || !db.has('lights')) return logger.error('The tradni server isn\'t running, or hasn\'t found any lights.');
        db.set('setState', 'on');
        logger.log('Turned active light on.');
    break;
    
    case "off":
        if(!connected || !db.has('lights')) return logger.error('The tradni server isn\'t running, or hasn\'t found any lights.');
        db.set('setState', 'off');
        logger.log('Turned active light off.');
    break;

    case "toggle":
        if(!connected || !db.has('lights')) return logger.error('The tradni server isn\'t running, or hasn\'t found any lights.');
        db.set('toggle', ':)');
        logger.log('Toggled active light.');
    break;

    case "flash":
        if(!connected || !db.has('lights')) return logger.error('The tradni server isn\'t running, or hasn\'t found any lights.');
        
        if(!args[0]) args[0] = 'ff006a';
        if(args[0][0] != '#') args[0] = `#${args[0]}`;

        db.set('pulse', args[0]);
        logger.log('Flashed active light.');

    break;
    
    case "color":
        if(!connected || !db.has('lights')) return logger.error('The tradni server isn\'t running, or hasn\'t found any lights.');

        if(!args[0]) return logger.error('Please provide a hex formatted color. Keep in mind, your terminal might not allow an unescaped \'#\' symbol.');
        if(args[0].length < 6 || args[0].length > 7) return logger.error('Please provide a hex formatted color');
        if(args[0][0] != '#') args[0] = `#${args[0]}`;

        db.set('colour', args[0]);
        logger.log('Set active light\'s color.');
        
    break;

    case "brightness":
        if(!connected || !db.has('lights')) return logger.error('The tradni server isn\'t running, or hasn\'t found any lights.');

        if(!args[0] || parseInt(args[0]) != args[0] || parseInt(args[0]) > 100 || parseInt(args[0]) < 0) return logger.error('Please provide an integer value between 0 and 100');

        db.set('brightness', parseInt(args[0]));
        logger.log('Set active light\'s brightness.');
        
    break;

    case "server":
        if(db.has('connection') && args[0] != 'force') return logger.error('There appears to already be a server running, or a server incorrecly closed.\n    If you\'re sure a server isn\'t running, use \'tradni server force\'')
        logger.log("Starting tradfri server..\n");
        require('./server').run();
    break;

    case "log":
        logger.log("Current logfile: \n" + logger.logFile());
    break;

    default:
        logger.error(`No command linked to '${extras.sentenceCase(command)}'.\n    Use 'tradni help' for help.`);
    break;
    
}

/** Functions **/

function cbexec(command) {
    return new Promise((resolve, reject) => {
      exec(command, { timeout: 5000 }, (err, stdOut) => {
          if (stdOut) {
            try {
              const split = stdOut.split('\n');
              resolve(JSON.parse(split[3] || split[0]));
            } catch (errResponse) {
              logger.error(`An invalid response was sent back by the gateway.\n    Error stack is as followed:\n    ${errResponse.stack}`);
              process.exit(1);
            }
          } else {
            logger.error(`Couldn't reach gateway.\n   Command run: '${command}'`);
            process.exit(1);
          }
      });
    });
}