class RemindersService {
  constructor(remindersRepo, reminderInterval) {
    this.remindersRepo = remindersRepo
    this.reminderInterval = reminderInterval
  }

  remind(app, callable) {
    const timerId = setInterval(callable, this.reminderInterval)
    return this.remindersRepo.add(app, timerId)
                             .then(() => timerId)
  }
}
