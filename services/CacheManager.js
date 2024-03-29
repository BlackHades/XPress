"use strict";

const redis = require("redis");
const {promisify} = require("util");
const debug = require("debug")("app:debug");
const redisClient = redis.createClient(
    {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        prefix: `chiji14xchange:${process.env.APP_ENV}:`
    }
);

const password = process.env.REDIS_PASSWORD || null;
if(password  && password != "null"){
    debug("add", password, process.env.REDIS_PASSWORD, typeof password);
    redisClient.auth(password, (err,res) => {
        debug("res",res);
        debug("err",err);
    });
}

try{
    redisClient.getAsync = promisify(redisClient.get).bind(redisClient);
    redisClient.setAsync = promisify(redisClient.set).bind(redisClient);
    redisClient.lpushAsync = promisify(redisClient.lpush).bind(redisClient);
    redisClient.lrangeAsync = promisify(redisClient.lrange).bind(redisClient);
    redisClient.llenAsync = promisify(redisClient.llen).bind(redisClient);
    redisClient.lremAsync = promisify(redisClient.lrem).bind(redisClient);
    redisClient.lsetAsync = promisify(redisClient.lset).bind(redisClient);
    redisClient.hmsetAsync = promisify(redisClient.hmset).bind(redisClient);
    redisClient.hmgetAsync = promisify(redisClient.hmget).bind(redisClient);
    redisClient.hgetallAsync = promisify(redisClient.hgetall).bind(redisClient);
    redisClient.clear = promisify(redisClient.del).bind(redisClient);
}catch (e) {
    debug("redis error", e);
}


redisClient.on("connected", function () {
    debug("Redis is connected");
});
redisClient.on("error", function (err) {
    debug("Redis error.", err);
});

module.exports = redisClient;