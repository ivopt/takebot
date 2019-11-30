import RemindersService from '#/src/core/reminders/RemindersService'

const arrayContaining = expect.arrayContaining

const memoize = (fn) => {
  let memo
  return () => memo || (memo = fn())
}

describe('RemindersService', () => {
  const RemindersRepo = memoize(() => ({ 
    add: jest.fn(), 
    remove: jest.fn(),
    all: jest.fn(),
    find: jest.fn()
  }))
  const Notifier = memoize(() => ({ notifyUser: jest.fn() }))
  const remindIn = 10

  const Subject = (
    remindersRepo = RemindersRepo(),
    notifier = Notifier(),
    timeout = remindIn
  ) => new RemindersService(remindersRepo, notifier, timeout)

  beforeEach(() => {
    jest.useFakeTimers()
  })

  describe('#add', () => {
    it('Adds a reminder to the remindersRepo and setups a regular notifier', async () => {
      const remindersService = Subject()
      await remindersService.add({
        app: 'appA',
        user: 'userName',
        message: 'a message'
      })

      expect(RemindersRepo().add).toBeCalledWith('appA', { app: 'appA', user: 'userName', message: 'a message' })
      expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 10)

      jest.runOnlyPendingTimers()

      expect(Notifier().notifyUser).toBeCalledWith('userName', 'a message')
    })
  })

  describe('#remove', () => {
    it('Removes a return app reminder and clears the notifier', async () => {
      const remindersService = Subject()
      await remindersService.remove({app: 'appA'})

      expect(RemindersRepo().remove).toBeCalledWith('appA')
      expect(clearInterval).toHaveBeenCalled()
    })
  })

  describe('#list', () => {
    it('delegates to the repo', async () => {

    })
  })

  describe('#recoverPersistedReminders', () => {
    // After a restart, persisted reminders need to be reinstated as their timeouts
    // will have disappeared after the shutdown.
    const reminders = [
      { app: 'appA', user: 'user 1', message: 'message 1' },
      { app: 'appB', user: 'user 2', message: 'message 2' }
    ]
    const RemindersRepo = memoize(() => ({all: () => Promise.resolve(reminders)}))

    it('recovers reminders persisted on the DB', async () => {
      const remindersService = Subject(RemindersRepo())
      await remindersService.reinstateStoredReminders()

      expect(setInterval).toHaveBeenCalledTimes(2)

      jest.runOnlyPendingTimers()

      expect(Notifier().notifyUser).toBeCalledWith('user 1', 'message 1')
      expect(Notifier().notifyUser).toBeCalledWith('user 2', 'message 2')
    })
  })
})
