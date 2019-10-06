import { Locator } from './util/Locator'
import PromiseRedis from './redis/PromiseRedis'
import AppsRepo from './redis/apps/AppsRepo'
import RemindersRepo from './memory/reminders/RemindersRepo'
import Messages from './messages'
import SlackbotNotifier from './slackbot/SlackbotNotifier'
// import TakeNotifier from './memory/TakeNotifier'

import TakeApp from './core/apps/features/TakeApp'
import ReturnApp from './core/apps/features/ReturnApp'
import ShowStatus from './core/apps/features/ShowStatus'
import ListApps from './core/apps/features/ListApps'
import AddApp from './core/apps/features/AddApp'

const locator = Locator()
locator.singleton(PromiseRedis.createClient({url: process.env['REDIS_URL']}), {name: 'redisClient'})
       .singleton(Messages, {name: 'messages'})
      //  TODO: Reinstate the Slackbot Notifier
       .singleton(new SlackbotNotifier(), { name: 'notifier' })
      //  .singleton(new TakeNotifier(), { name: 'notifier' })
       .singleton(new AppsRepo(locator.redisClient, process.env['ROOT_KEY']))
       .singleton(new RemindersRepo())
       .fnFactory(TakeApp, { args: { remindIn: 1000 } })
       .fnFactory(ReturnApp, { name: 'returnApp' })
       .fnFactory(ShowStatus)
       .fnFactory(ListApps)
       .fnFactory(AddApp)
       .onExit(() => {
         locator.redisClient.quit()
       })
       .onReset(async () => {
         await locator.redisClient.flushall()
         locator.notifier.reset()
       })

export default locator
