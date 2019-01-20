import SlackBot from 'slackbots'
import express from 'express'
import bodyParser from 'body-parser'
import 'babel-polyfill'

import './env.config'
import Context from './Context'


// const bot = new SlackBot({
//   token: process.env.SLACKBOT_KEY,
//   name: 'TakeBot'
// })



Context.appsRepo.setApps(["appA", "appB"])


const server = express()
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())

// server.get('/take', (req, res) => {
//   console.log(req.query)

//   res.send('hello GET')
// })

server.post('/take', (req, res) => {
  // console.log(req.body)
  // bot.postMessageToUser('ivo.jesus', `Taken ${req.body.text}`)
  // bot.postMessageToChannel('general', `${req.body.user_name} has taken ${req.body.text}`)

  // console.log(req.body.app)
  // console.log(req.body.user)
  // console.log(process.env.REDIS_URL)
  Context.takeApp(req.body.app, req.body.user)
         .then(() => res.json())
         .catch(() => res.sendStatus(404))
})

server.post('/return', (req, res) => {
  // console.log(req.body)
  // bot.postMessageToUser('ivo.jesus', `Taken ${req.body.text}`)
  // bot.postMessageToChannel('general', `${req.body.user_name} has taken ${req.body.text}`)

  // console.log(req.body.app)
  // console.log(req.body.user)
  // console.log(process.env.REDIS_URL)
  Context.returnApp(req.body.app, req.body.user)
         .then(() => res.json())
         .catch(() => res.sendStatus(404))
})

const run = () =>
  server.listen(3000, () => console.log('Listening on port 3000'))


module.exports = { run }
