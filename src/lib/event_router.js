var Config = require('./config'),
    logger = require('./logger');

/**
 * Single entry point for handling events
 *
 * @param sub subscribe object
 * @param pub publish object
 * @param event object
 */
module.exports.handle = function(sub, pub, event) {

    var index = 0;

    logger.info('Handled event: ' + JSON.stringify(event));

    // test event.name == 'repo-mon.update.scheduled'

    // get token from token service
    // get repository data from repository service

    pub.write(JSON.stringify({
        name: 'repo-mon.event.reported',
        data : {
            body: {
                index: index++
            },
            type: "application/json"
        }
    }));

};