var Config = require('./config'),
    logger = require('./logger'),
    request = require('request');


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

        // get repository data
        var repo_uri = Config.getRepositoryService() + '/repositories/' + event.data.full_name;

        request(repo_uri, function(err, response, body){

            if (!err) {

                repository = JSON.parse(body);

                // check if repository is active and we support it
                if ('1' == repository.active) {

                    var token_uri =  Config.getTokenService() + '/tokens/' + repository.owner;

                    request(token_uri, function (err, response, body) {

                        if (!err) {

                            // publish an update command
                            pub.write(JSON.stringify( {
                                name: 'command.repository.update',
                                data: {
                                    url : repository.url,
                                    token : body,
                                    language : repository.lang,
                                    dependency_manager : repository.dependency_manager
                                }
                            }));

                        } else {
                            logger.info("Error from " + token_uri + ' ' + err);
                        }
                    });
                }
            } else {
                logger.info("Error from " + repo_uri + ' ' + err);
            }
        });

        // get token from token service
        // get repository data from repository service

        pub.write(JSON.stringify({
            name: 'repo-mon.event.reported',
            data: {
                time: Math.floor(Date.now() / 1000)
            }
        }));
    }
};