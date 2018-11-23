'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('util');

var _redis = require('redis');

exports.default = {
  createClient: function createClient(_ref) {
    var url = _ref.url;

    var client = (0, _redis.createClient)({ url: url });
    return {
      get: (0, _util.promisify)(client.get).bind(client),
      set: (0, _util.promisify)(client.set).bind(client),
      hget: (0, _util.promisify)(client.hget).bind(client),
      hgetall: (0, _util.promisify)(client.hgetall).bind(client),
      hset: (0, _util.promisify)(client.hset).bind(client),
      hdel: (0, _util.promisify)(client.hdel).bind(client)
    };
  }
};