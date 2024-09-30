const taskQueue = require('../utils/taskQueue');
const rateLimiter = require('../utils/rateLimiter');

exports.processTask = async (req, res) => {
    const { user_id } = req.body;

    const allowed = await rateLimiter.checkRateLimit(user_id);
    if (!allowed) {
        await taskQueue.enqueueTask(user_id, req.body);
        return res.status(429).send('Rate limit exceeded, task queued.');
    }

    taskQueue.processTask(user_id);
    res.status(200).send('Task processed.');
};