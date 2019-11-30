import IRemindersRepo from "../../core/reminders/IRemindersRepo"
import { transformOne, transformValues, coalesce } from "../helpers"

export default class RemindersRepo extends IRemindersRepo {
  constructor(redisClient, rootKey) {
    super()
    this.redisClient = redisClient
    this.remindersKey = `${rootKey}:reminder`
  }

  all = () => this.redisClient.hgetall(this.remindersKey)
                              .then(coalesce({}))
                              .then(transformValues(JSON.parse))

  find = (app) => this.redisClient.hget(this.remindersKey, app)
                                  .then(coalesce(undefined))
                                  .then(transformOne(JSON.parse))

  add = (app, {user, message}) =>
    this.find(app)
        .then((val) => { if (val) throw 'Reminder is already set' })
        .then(() => {
          const reminder = {app, user, message}
          this.redisClient.hset(this.remindersKey, app, JSON.stringify(reminder))
          return reminder
        })

  remove = (app) => this.redisClient.hdel(this.remindersKey, app)
}
