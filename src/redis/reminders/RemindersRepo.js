const transformOne = (t, defaultValue) => (v) => v && t(v) || defaultValue
const transformValues = (t) => (object) =>
  Object.entries(object)
        .reduce((acc, [k, v]) => ({...acc, [k]: t(v)}), {})
const coalesce = (defaultOutput) => (input) => input ? input : defaultOutput

class RemindersRepo {
  constructor(redisClient, rootKey) {
    this.redisClient = redisClient
    this.reminders = `${rootKey}:reminder`
  }

  all() {
    return this.redisClient.hgetall(this.reminders)
                           .then(coalesce({}))
                           .then(transformValues(Number))
  }

  find(app){
    return this.redisClient.hget(this.reminders, app)
                           .then(coalesce(undefined))
                           .then(transformOne(Number))
  }

  add(app, timerId) {
    return this.find(app)
               .then((val) => { if (val) throw 'Reminder is already set' })
               .then(() => this.redisClient.hset(this.reminders, app, timerId))
  }

  remove(app) {
    return this.redisClient.hdel(this.reminders, app)
  }
}

export default RemindersRepo
