import IRemindersRepo from "../../core/reminders/IRemindersRepo"

export default class RemindersRepo extends IRemindersRepo {
  constructor() {
    super()
    this.reminders = {}
  }

  all = () => Promise.resolve(this.reminders)

  find = (app) => Promise.resolve(this.reminders[app])

  add = (app, { user, message }) => {
    if (this.reminders[app])
      return Promise.reject("Reminder is already set")
    return Promise.resolve(this.reminders[app] = {app, user, message})
  }

  remove = (app) => {
    Promise.resolve(delete this.reminders[app])
  }

  reset = () => this.reminders = {}
}
