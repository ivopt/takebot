import { Locator } from '#/src/util/Locator'
import PromiseRedis from '#/src/util/PromiseRedis'
import AppsRepo from '#/src/redis/apps/AppsRepo'
import RemindersRepo from '#/src/redis/reminders/RemindersRepo'

const locator = Locator()
locator.register('redisClient', PromiseRedis.createClient({url: process.env['REDIS_URL']}))
       .register('appsRepo', new AppsRepo(locator.redisClient))
       .register('remindersRepo', new RemindersRepo(locator.redisClient, process.env['ROOT_KEY']))
       .onExit(() => {
         locator.redisClient.quit()
       })
       .onReset(() => {
         locator.redisClient.flushall()
       })

export default locator
