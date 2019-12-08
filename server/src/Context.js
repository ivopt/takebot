import { Locator } from './util/Locator'
import PromiseRedis from './redis/PromiseRedis'
import AppsRepo from './redis/apps/AppsRepo'
import RemindersRepo from './redis/reminders/RemindersRepo'
import RemindersService from '#/src/core/reminders/RemindersService'
import Messages from './messages'
import SlackbotNotifier from './slackbot/SlackbotNotifier'
// import TakeNotifier from './memory/TakeNotifier'

import Features from './core/features'

const locator = Locator()
locator.singleton(PromiseRedis.createClient({url: process.env['REDIS_URL']}), {name: 'redisClient'})
       .singleton(Messages, {name: 'messages'})
      //  TODO: Reinstate the Slackbot Notifier
       .singleton(new SlackbotNotifier(), { name: 'notifier' })
      //  .singleton(new TakeNotifier(), { name: 'notifier' })
       .singleton(new AppsRepo(locator.redisClient, process.env['ROOT_KEY']))
       .singleton(new RemindersRepo(locator.redisClient, process.env['ROOT_KEY']))
       .singleton(new RemindersService(locator.remindersRepo, locator.notifier, 4000))
       .fnFactory(Features.TakeApp, { args: { remindIn: 4000 } })
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
       })

export default locator
