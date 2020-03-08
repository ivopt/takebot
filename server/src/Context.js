import { Locator } from './util/Locator'
import PromiseRedis from './redis/PromiseRedis'
import AppsRepo from './redis/apps/AppsRepo'
import TakenAppsRepo from './redis/apps/TakenAppsRepo'
import AppsService from './core/apps/AppsService'
import RemindersRepo from './redis/reminders/RemindersRepo'
import RemindersService from './core/reminders/RemindersService'
import Messages from './messages'
import SlackbotNotifier from './slackbot/SlackbotNotifier'
// Offline DEV harness
// import TakeNotifier from './memory/TakeNotifier'

import Features from './core/features'

const locator = Locator()
locator.singleton(PromiseRedis.createClient({url: process.env['REDIS_URL']}), {name: 'redisClient'})
       .singleton(Messages, {name: 'messages'})
       .singleton(new SlackbotNotifier(), { name: 'notifier' })
       // Offline DEV harness
       //  .singleton(new TakeNotifier(), { name: 'notifier' })
       .singleton(new AppsRepo(locator.redisClient, process.env['ROOT_KEY']))
       .singleton(new TakenAppsRepo(locator.redisClient, process.env['ROOT_KEY']))
       .singleton(new RemindersRepo(locator.redisClient, process.env['ROOT_KEY']))
       .singleton(new RemindersService(locator.remindersRepo, locator.notifier, process.env['REMIND_IN'] || 1200000))
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
