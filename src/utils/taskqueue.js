const Redis = require('ioredis');
const fs = require('fs');
const { promisify } = require('util');
const appendFile = promisify(fs.appendFile);
const redis = new Redis();

exports.enqueueTask = async (user_id, task) => {
    await redis.lpush(`queue:${user_id}`, JSON.stringify(task));
};

exports.processTask = async (user_id) => {
    const taskData = await redis.rpop(`queue:${user_id}`);
    if (taskData) {
        const task = JSON.parse(taskData);
        const logMessage = `${user_id} - task completed at - ${Date.now()}\n`;
        await appendFile('src/logs/task.log', logMessage);
        console.log(logMessage);
    }
};