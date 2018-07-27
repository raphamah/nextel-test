const PubSub = require('pubsub-js');
// POST a subscribe
exports.subscribe = (req, res) => {
    
    PubSub.subscribe('channel', function (msg, data) {
        res.send(data);
    });
};