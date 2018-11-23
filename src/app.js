const SlackBot = require('slackbots')
const express = require('express')
const bodyParser = require('body-parser')

// const bot = new SlackBot({
//   token: 'xoxb-6312984534-466762561479-pGbqIh81S9oqklepVyq7CYST',
//   name: 'TakeBot'
// })

const server = express()
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())

// server.route({
//   method: "POST",
//   path: '/take',
//   handler: (request, h) => {
//     console.log(request.params)
//     // bot.postMessageToChannel('general', 'Hello World!')
//     return 'hello POST'
//   }
// })

server.get('/take', (req, res) => {
  console.log(req.query)
  res.send('hello GET')
})

server.post('/take', (req, res) => {
  console.log(req.body)
  res.json(req.body)
})

const run = () =>
  server.listen(3000, () => console.log('Listening on port 3000'))

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

import dotenv from 'dotenv'
import redis from './util/PromiseRedis'

dotenv.config()

const Apps = (apps, redis) => {
  const rootKey = "TakeBot"
  redis.set(`${rootKey}:apps`, JSON.stringify(apps))

  return {
    list: () => apps,
    take: (app, user) => redis.hset(`${rootKey}:taken`, app, user),
    release: (app) => redis.hdel(`${rootKey}:taken`, app),
    holder: (app) => redis.hget(`${rootKey}:taken`, app),
    status: () => redis.hgetall(`${rootKey}:taken`),
  }
}

//------------------------------------------------------------------------------
// UseCases

// { "app_name": "username" }
const TakeApp = (app, user) =>
  Promise.resolve({app, user})
         .then(CheckIfAppExists)
         .then(CheckIfAppIsTaken)
         .then(TakeAppForUser)
         .then(SetReminder)
         .then(WarnInChannel)

const CheckIfAppExists = (ctx) => {
  return ctx
}

const CheckIfAppIsTaken = (ctx) => {
  return ctx
}

const TakeAppForUser = (ctx) => {
  return ctx
}

const SetReminder = (ctx) => { return ctx }

const WarnInChannel = (ctx) => {
  return ctx
}

// export {Apps}
module.exports = { run, redis, Apps }
