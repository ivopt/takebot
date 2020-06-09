export default class RemindersService {
  constructor(remindersRepo, notifier, remindIn) {
    this.remindersRepo = remindersRepo
    this.notifier = notifier
    this.remindIn = remindIn
    this.intervals = {}
  }

  add = async ({app, user, message, lease}) => {
    lease = lease || this.remindIn
    await this.remindersRepo.add(app, {app, user, message, lease})

    this.intervals[app] =
      setInterval(() => this.notifier.notifyUser(user, message), lease)
  }

  remove = async ({app}) => {
    await this.remindersRepo.remove(app)
    clearInterval(this.intervals[app])
  }

  all = async () => await this.remindersRepo.all()
  find = async (name) => await this.remindersRepo.find(name)

  reinstateStoredReminders = async () => {
    const list = await this.remindersRepo.all()

    Object.values(list).forEach(({app, user, message, lease}) => {
      this.intervals[app] =
        setInterval(() => this.notifier.notifyUser(user, message), lease)
    })
  }
}
