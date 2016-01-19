var rabbitmq = require('rabbit.js');

var queue_url = 'amqp://' + process.env.RABBITMQ_PORT_5672_TCP_ADDR + ':' + process.env.RABBITMQ_PORT_5672_TCP_PORT;

/**
 * @returns {*}
 */
module.exports.getQueueContext = function() {

    'use strict';

    if (!module.exports.queue_context){
        module.exports.queue_context = rabbitmq.createContext(queue_url);
    }

    return module.exports.queue_context;
};

/**
 *
 * @returns {string}
 */
module.exports.getQueueName = function () {
    return 'repo-mon.main';
};