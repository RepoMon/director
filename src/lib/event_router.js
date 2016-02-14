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

    logger.info('Received event: ' + JSON.stringify(event));

    // act on events named 'repo-mon.update.scheduled'

    if (event.name == 'repo-mon.update.scheduled') {

        // get repository data
        var repo_uri = Config.getRepositoryService() + '/repositories/' + event.data.full_name;

        request(repo_uri, function(repo_err, response, body){

            if (!repo_err) {

                logger.info('Repository response body: ' + body);

                repository = JSON.parse(body);

                // check if repository is active and we support it
                if ('1' == repository.active) {

                    var token_uri =  Config.getTokenService() + '/tokens/' + repository.owner;

                    request(token_uri, function (token_err, response, body) {

                        if (!token_err) {

                            // publish an update command
                            pub.write(JSON.stringify( {
                                name: 'command.repository.update',
                                data: {
                                    url : repository.url,
                                    token : body,
                                    language : repository.lang,
                                    dependency_manager : repository.dependency_manager,
                                    full_name: event.data.full_name,
                                    branch: repository.branch
                                },
                                version: '1.0.0'
                            }));

                        } else {
                            logger.info("Error from " + token_uri + ' ' + token_err);
                        }
                    });
                }
            } else {
                logger.info("Error from " + repo_uri + ' ' + repo_err);
            }
        });

        // get token from token service
        // get repository data from repository service

        pub.write(JSON.stringify({
            name: 'repo-mon.event.reported',
            data: {
                time: Math.floor(Date.now() / 1000)
            },
            version: '1.0.0'
        }));
    }
};