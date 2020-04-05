import { Locator } from '#/src/util/Locator'
import PromiseRedis from '#/src/redis/PromiseRedis'
import AppsRepo from '#/src/redis/apps/AppsRepo'
import TakenAppsRepo from '#/src/redis/apps/TakenAppsRepo'
import AppsService from '#/src/core/apps/AppsService'
import RemindersRepo from '#/src/redis/reminders/RemindersRepo'
import RemindersService from '#/src/core/reminders/RemindersService'
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
       .singleton(new TakenAppsRepo(locator.redisClient, process.env['ROOT_KEY']))
       .singleton(new RemindersRepo(locator.redisClient, process.env['ROOT_KEY']))
       .singleton(new MockedNotifier(), {name: 'notifier'})
       .singleton(new RemindersService(locator.remindersRepo, locator.notifier, 1000))
       .singleton(new AppsService(locator.appsRepo, locator.takenAppsRepo))
       .fnFactory(Features.TakeApp)
       .fnFactory(Features.ReturnApp)
       .fnFactory(Features.ShowStatus)
       .fnFactory(Features.ListApps)
       .fnFactory(Features.AddApp)
       .fnFactory(Features.RemoveApp)
       .onExit(() => {
         locator.redisClient.quit()
       })
       .onReset(async () => {
         await locator.redisClient.flushdb()
         locator.notifier.reset()
       })

export default locator
