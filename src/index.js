var logger = require('./lib/logger'),
    event_router = require('./lib/event_router'),
    Config = require('./lib/config');

logger.info('running');

var context = Config.getQueueContext();

context.on('ready', function() {

    logger.info('connected');

    logger.info('Running director service');

    var sub = context.socket('SUB'),
        pub = context.socket('PUB');

    var queue = Config.getQueueName();

    pub.connect(queue, function() {
        sub.connect(queue, function () {
            // route events as they arrive
            sub.on('data', function (body) {
                event_router.handle(sub, pub, JSON.parse(body));
            });
        });
    });
});
