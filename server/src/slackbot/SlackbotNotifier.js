import SlackBot from 'slackbots'
import ITakeNotifier from "../core/notifications/ITakeNotifier"

export default class SlackBotNotifier extends ITakeNotifier {
  constructor() {
    super()
    this.bot = new SlackBot({
      token: process.env.SLACKBOT_KEY,
      name: 'TakeBot'
    })
  }

  notifyTeam = (message) => this.bot.postMessageToChannel(process.env["SLACK_CHANNEL"], message)
  notifyUser = (user, message) => this.bot.postMessageToUser(user, message)
}
