// import SlackBot from 'slackbots'
import './env.config'
import Context from './Context'
import WebApp from './web/WebApp'

// const bot = new SlackBot({
//   token: process.env.SLACKBOT_KEY,
//   name: 'TakeBot'
// })

Context.appsRepo.setApps(["appA", "appB"])

const run = () => WebApp(Context).run()

module.exports = { run }
