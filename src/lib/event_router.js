var Config = require('./config'),
    logger = require('./logger');


var index = 0;

/**
 * Handle update scheduled events by publishing events for update services
 *
 * @param sub subscribe object
 * @param pub publish object
 * @param event object
 */
module.exports.handle = function(sub, pub, event) {

    logger.info('Handled event: ' + JSON.stringify(event));

    // act on events named 'repo-mon.update.scheduled'

    if (event.name == 'repo-mon.update.scheduled') {

        // get token from token service
        // get repository data from repository service

        pub.write(JSON.stringify({
            name: 'repo-mon.event.reported',
            data: {
                index: index++
            }
        }));
    }

};