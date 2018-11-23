'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _PromiseRedis = require('./util/PromiseRedis');

var _PromiseRedis2 = _interopRequireDefault(_PromiseRedis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SlackBot = require('slackbots');
var express = require('express');
var bodyParser = require('body-parser');

// const bot = new SlackBot({
//   token: 'xoxb-6312984534-466762561479-pGbqIh81S9oqklepVyq7CYST',
//   name: 'TakeBot'
// })

var server = express();
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// server.route({
//   method: "POST",
//   path: '/take',
//   handler: (request, h) => {
//     console.log(request.params)
//     // bot.postMessageToChannel('general', 'Hello World!')
//     return 'hello POST'
//   }
// })

server.get('/take', function (req, res) {
  console.log(req.query);
  res.send('hello GET');
});

server.post('/take', function (req, res) {
  console.log(req.body);
  res.json(req.body);
});

var run = function run() {
  return server.listen(3000, function () {
    return console.log('Listening on port 3000');
  });
};

// export { run }

// bot.on('start', () => {
//   bot.postMessageToChannel('general', 'Hello World!');
// });

// const promisify = require('util').promisify
// const client = require("redis").createClient({url: "redis://0.0.0.0:16379"})
// const redis = {
//   get:      promisify(client.get).bind(client),
//   set:      promisify(client.set).bind(client),
//   hget:     promisify(client.hget).bind(client),
//   hgetall:  promisify(client.hgetall).bind(client),
//   hset:     promisify(client.hset).bind(client),
//   hdel:     promisify(client.hdel).bind(client),
// }

_dotenv2.default.config();
// const redis = require('./util/PromiseRedis').default

var Apps = function Apps(apps, redis) {
  var rootKey = "TakeBot";
  redis.set(rootKey + ':apps', JSON.stringify(apps));

  return {
    list: function list() {
      return apps;
    },
    take: function take(app, user) {
      return redis.hset(rootKey + ':taken', app, user);
    },
    release: function release(app) {
      return redis.hdel(rootKey + ':taken', app);
    },
    holder: function holder(app) {
      return redis.hget(rootKey + ':taken', app);
    },
    status: function status() {
      return redis.hgetall(rootKey + ':taken');
    }
  };
};

//------------------------------------------------------------------------------
// UseCases

var TakeApp = function TakeApp(app, user) {
  return Promise.resolve({ app: app, user: user }).then(CheckIfAppExists).then(CheckIfAppIsTaken).then(TakeAppForUser).then(WarnInChannel);
};

var CheckIfAppExists = function CheckIfAppExists(ctx) {
  return ctx;
};

var CheckIfAppIsTaken = function CheckIfAppIsTaken(ctx) {
  return ctx;
};

var TakeAppForUser = function TakeAppForUser(ctx) {
  return ctx;
};

var WarnInChannel = function WarnInChannel(ctx) {
  return ctx;
};

// export {Apps}
module.exports = { run: run, redis: _PromiseRedis2.default, Apps: Apps };