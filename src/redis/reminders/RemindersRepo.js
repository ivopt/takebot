import IRemindersRepo from "../../core/reminders/IRemindersRepo"

export default class RemindersRepo extends IRemindersRepo {
  constructor(redisClient, rootKey) {
    super()
    this.redisClient = redisClient
    this.reminders = `${rootKey}:reminder`
  }

  all = () => this.redisClient.hgetall(this.reminders)
                              .then(coalesce({}))
                              .then(transformValues(Number))

  find = (app) => this.redisClient.hget(this.reminders, app)
                                  .then(coalesce(undefined))
                                  .then(transformOne(Number))

  add = (app, timerId) =>
    this.find(app)
        .then((val) => { if (val) throw 'Reminder is already set' })
        .then(() => this.redisClient.hset(this.reminders, app, timerId))

  remove = (app) => this.redisClient.hdel(this.reminders, app)
}

// Helpers ---------------------------------------------------------------------
const transformOne = (t, defaultValue) => (v) => v && t(v) || defaultValue
const transformValues = (t) => (object) =>
  Object.entries(object)
        .reduce((acc, [k, v]) => ({...acc, [k]: t(v)}), {})
const coalesce = (defaultOutput) => (input) => input ? input : defaultOutput
