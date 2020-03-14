/** Prerequisites */

const ntc = require('node-tradfri-client');
const db = require('quick.db');

/** Helpers **/

const logger = require('./helpers/logger');
const color = require('./helpers/color');

/** Gateway Connection **/

const connection = db.has('gateway') ? db.get('gateway') : null;
if(connection == null) {
    logger.error('No connection details found.\n    Please use \'tradni gateway\'.');
    process.exit(1);
}

exports.run = () => {

    const lights = {};
    var pre = JSON.stringify(db.all());
    var light= db.has('light') ? db.get('light') : null;
    var activeLight = {};

    (async () => {

        db.set('connection', true);

        const tradfri = new ntc.TradfriClient(connection.ip);
        try {
            await tradfri.connect(connection.identity, connection.psk);
        } catch (e) {
            logger.error('Error whilst connecting to gateway: \n' + e.stack);
            process.exit(1);
        }

        logger.clear();
        logger.log(`Connected to gateway (${connection.ip}).`);
        logger.nl();

        setInterval(() => lookForChanges(), 250);

        tradfri
            .on("device updated", tradfri_deviceUpdated)
            .on("device removed", tradfri_deviceRemoved)
            .observeDevices();

        function tradfri_deviceUpdated(device) {
            if (device.type === ntc.AccessoryTypes.lightbulb) {
                logger.log(`Found Light ${device.instanceId} ('${device.name}').`)
                lights[device.instanceId] = device;
                db.set('lights', lights);
            }
        }
        
        function tradfri_deviceRemoved(device) {
            if (device.type === ntc.AccessoryTypes.lightbulb) {
                logger.log(`Light Disconnected ${device.instanceId} ('${device.name}').`)
                lights[device.instanceId] = null;
                db.set('lights', lights);
            }
        }

    })();

    function lookForChanges() {

        if(pre == JSON.stringify(db.all())) return;

        activeLight = lights[light].lightList[0];

        if(db.has('light')) {
            
            if(light != db.get('light')) logger.log(`Changing active light ${light} ~> ${db.get('light')}`);

            light = db.get('light');
            activeLight = lights[light].lightList[0];

            if(lights[light] == null) {
                light = null;
                activeLight = null;
                return db.delete('light'); 
            }
        }
        else return light = null;

        if(db.has('setState')) {

            var state = db.get('setState');

            logger.log(`Changing light state to '${state}'.`)

            if(activeLight.isSwitchable) {
                
                if(state == 'on') activeLight.turnOn();
                if(state == 'off') activeLight.turnOff();

                db.delete('setState');

            } else {
                logger.warn('Couldn\'t set light state as it isn\'t switchable.')
                db.delete('setState');
            }
        
        }

        if(db.has('toggle')) {
            
            logger.log('Toggling light state');

            if(activeLight.isSwitchable) {
                
                activeLight.toggle();
                db.delete('toggle');

            } else {
                logger.warn('Couldn\'t toggle light state as it isn\'t switchable.');
                db.delete('toggle');
            }

        }

        if(db.has('pulse')) {
            
            logger.log('Pulsing light');

            if(activeLight.isSwitchable && activeLight.isDimmable) {

                var prevColour = activeLight.color;
                activeLight.setColor(db.get('pulse').slice(1));

                setTimeout(() => activeLight.setColor(prevColour, 0.5), 1000);
                
                db.delete('pulse');

            } else {
                logger.warn('Couldn\'t dim and or toggle light state, as the current light isnt dimm / switch -able');
                db.delete('pulse');
            }

        }

        if(db.has('colour')) {
            
            activeLight.setColor(db.get('colour').slice(1), 0.5);
            db.delete('colour');

            logger.log('Set lights colour');
        }

        if(db.has('brightness')) {
            
            if(activeLight.isSwitchable && activeLight.isDimmable) {

                activeLight.setBrightness(db.get('brightness'), 0.5);
                db.delete('brightness');

            } else {
                logger.warn('Couldn\'t dim and or toggle light state, as the current light isnt dimm / switch -able');
                db.delete('brightness');
            }

        }    
        pre = JSON.stringify(db.all());

    }

    process.on('SIGTERM', () => {
        db.delete('connection');
    })

};

