import { Locator } from '#/src/util/Locator'
import PromiseRedis from '#/src/redis/PromiseRedis'
import AppsRepo from '#/src/redis/apps/AppsRepo'
import RemindersRepo from '#/src/memory/reminders/RemindersRepo'
import ITakeNotifier from '#/src/core/notifications/ITakeNotifier'
import Messages from '#/src/messages'
import Features from '#/src/core/features'

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
locator.singleton(PromiseRedis.createClient({url: process.env['REDIS_URL']}), {name: 'redisClient'})
       .singleton(Messages, {name: 'messages'})
       .singleton(new AppsRepo(locator.redisClient, process.env['ROOT_KEY']))
       .singleton(new RemindersRepo())
       .singleton(new MockedNotifier(), {name: 'notifier'})
       .fnFactory(Features.TakeApp, { args: { remindIn: 1000 } })
       .fnFactory(Features.ReturnApp, { name: 'returnApp' })
       .fnFactory(Features.ShowStatus)
       .fnFactory(Features.ListApps)
       .fnFactory(Features.AddApp)
       .onExit(() => {
         locator.redisClient.quit()
       })
       .onReset(async () => {
         await locator.redisClient.flushdb()
         locator.notifier.reset()
         locator.remindersRepo.reset()
       })

export default locator
