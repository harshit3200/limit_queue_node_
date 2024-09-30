const Redis = require('ioredis');
const redis = new Redis();

exports.checkRateLimit = async (user_id) => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const userKey = `user:${user_id}`;

    const [count, minuteCount] = await redis.multi()
        .incr(userKey + ':second')
        .expire(userKey + ':second', 1)
        .incr(userKey + ':minute')
        .expire(userKey + ':minute', 60)
        .exec();

    if (count[1] > 1 || minuteCount[1] > 20) {
        return false; // Rate limit exceeded
    }
    return true;
};