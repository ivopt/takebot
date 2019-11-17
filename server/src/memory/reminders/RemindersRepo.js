import IRemindersRepo from "../../core/reminders/IRemindersRepo"

export default class RemindersRepo extends IRemindersRepo {
  constructor() {
    super()
    this.reminders = {}
  }

  all = () => Promise.resolve(this.reminders)

  find = (app) => Promise.resolve(this.reminders[app])

  add = (app, { interval }) => {
    if (this.reminders[app])
      return Promise.reject("Reminder is already set")
    return Promise.resolve(this.reminders[app] = interval)
  }

  remove = (app) => {
    clearTimeout(this.reminders[app])
    Promise.resolve(delete this.reminders[app])
  }

  reset = () => this.reminders = {}
}
