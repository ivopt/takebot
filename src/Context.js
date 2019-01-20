import { Locator } from './util/Locator'
import PromiseRedis from './redis/PromiseRedis'
import AppsRepo from './redis/apps/AppsRepo'
import RemindersRepo from './redis/reminders/RemindersRepo'
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
locator.register('redisClient', PromiseRedis.createClient({url: process.env['REDIS_URL']}))
       .register('appsRepo', new AppsRepo(locator.redisClient, process.env['ROOT_KEY']))
       .register('remindersRepo', new RemindersRepo(locator.redisClient, process.env['ROOT_KEY']))
       .register('notifier', new MockedNotifier())
       .register('messages', Messages)
       .register('takeApp', TakeApp({appsRepo: locator.appsRepo,
                                     remindersRepo: locator.remindersRepo,
                                     notifier: locator.notifier,
                                     messages: locator.messages,
                                     remindeId: 10}))
       .register('returnApp', ReturnApp({appsRepo: locator.appsRepo,
                                         remindersRepo: locator.remindersRepo,
                                         notifier: locator.notifier,
                                         messages: locator.messages}))
       .onExit(() => {
         locator.redisClient.quit()
       })
       .onReset(() => {
         locator.redisClient.flushall()
         locator.notifier.reset()
       })

export default locator
