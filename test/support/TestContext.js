import { Locator } from '#/src/util/Locator'
import PromiseRedis from '#/src/redis/PromiseRedis'
import AppsRepo from '#/src/redis/apps/AppsRepo'
import RemindersRepo from '#/src/redis/reminders/RemindersRepo'
import ITakeNotifier from '#/src/core/ITakeNotifier'
import Messages from '#/src/messages'

// TODO: This is to be used on integration test. We don't wanna hit slack, but we
//       might wanna hit some faked API of some sort - stubby4node?
//       Regardless of what's used, we need to review this!
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
       .onExit(() => {
         locator.redisClient.quit()
       })
       .onReset(() => {
         locator.redisClient.flushall()
         locator.notifier.reset()
       })

export default locator
