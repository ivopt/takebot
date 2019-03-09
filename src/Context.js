import { Locator } from './util/Locator'
import PromiseRedis from './redis/PromiseRedis'
import AppsRepo from './redis/apps/AppsRepo'
import RemindersRepo from './memory/reminders/RemindersRepo'
import ITakeNotifier from './core/ITakeNotifier'
import Messages from './messages'

import TakeApp from './core/apps/features/TakeApp'
import ReturnApp from './core/apps/features/ReturnApp'

// TODO: TEMPORARY!
class MockedNotifier extends ITakeNotifier {
  constructor() {
    super()
    this.teamNotifications = []
    this.userNotifications = []
  }

  notifyUser = (user, message) => { this.userNotifications.push({user, message}) }
  notifyTeam = (message) => { this.teamNotifications.push({message}) }

  reset = () => {
    this.teamNotifications = []
    this.userNotifications = []
  }
}

const locator = Locator()
locator.singleton('redisClient', PromiseRedis.createClient({url: process.env['REDIS_URL']}))
       .singleton('messages', Messages)
       .singleton('notifier', new MockedNotifier())
       .singleton('appsRepo', new AppsRepo(locator.redisClient, process.env['ROOT_KEY']))
       .singleton('remindersRepo', new RemindersRepo())
       .fnFactory('takeApp',
                  TakeApp,
                  ['appsRepo', 'remindersRepo', 'notifier', 'messages'],
                  { remindIn: 10 })
       .fnFactory('returnApp',
                  ReturnApp,
                  ['appsRepo', 'remindersRepo', 'notifier', 'messages'])
       .onExit(() => {
         locator.redisClient.quit()
       })
       .onReset(() => {
         locator.redisClient.flushall()
         locator.notifier.reset()
       })

export default locator
