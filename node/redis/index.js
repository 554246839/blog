// https://www.npmjs.com/package/ioredis
const Redis = require('ioredis')
const { REDIS } = require('../config/default')

// new Redis("redis://:kd123456@127.0.0.1:6379/0");

module.exports = new Redis({
  port: REDIS.PORT,         // Redis port
  host: REDIS.HOST,         // Redis host
  prefix: REDIS.PREFIX,     //存诸前缀
  // ttl: REDIS.TTL,        //过期时间   
  // family: REDIS.FAMILY,
  password: REDIS.PASSWORD
  // db: 0
})