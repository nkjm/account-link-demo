"use strict";

const cache = require("memory-cache");

module.exports = class ServiceDb {
    static get(key){
        return cache.get(key);
    }

    static put(key, value, lifetime){
        return cache.put(key, value, lifetime);
    }

    static del(key){
        return cache.del(key);
    }
}
