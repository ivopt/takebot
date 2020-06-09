import RemindersService from '#/src/core/reminders/RemindersService'
import IRemindersRepo from '#/src/core/reminders/IRemindersRepo'
import ITakeNotifier from '#/src/core/notifications/ITakeNotifier'

import { memoizeFn, memoizedMockImpl } from '#/test/support/MockInterfaces'

describe('RemindersService', () => {
  const RemindersRepo = memoizedMockImpl(IRemindersRepo)
  const Notifier = memoizedMockImpl(ITakeNotifier)
  const remindIn = 10

  const Subject = (
    remindersRepo = RemindersRepo(),
    notifier = Notifier(),
    timeout = remindIn
  ) => new RemindersService(remindersRepo, notifier, timeout)

  beforeEach(() => { jest.useFakeTimers() })

  describe('#add', () => {
    it('Adds a reminder to the remindersRepo and setups a regular notifier', async () => {
      const remindersService = Subject()
      await remindersService.add({
        app: 'appA',
        user: 'userName',
        message: 'a message'
      })

      expect(RemindersRepo().add).toBeCalledWith('appA', { app: 'appA', user: 'userName', message: 'a message', lease: remindIn })
      expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), remindIn)

      jest.runOnlyPendingTimers()

      expect(Notifier().notifyUser).toBeCalledWith('userName', 'a message')
    })

    it('allows reminder interval to be specified', async () => {
      const remindersService = Subject()
      await remindersService.add({
        app: 'appA',
        user: 'userName',
        message: 'a message',
        lease: 600000
      })

      expect(RemindersRepo().add).toBeCalledWith('appA', { app: 'appA', user: 'userName', message: 'a message', lease: 600000 })
      expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 600000)

      jest.advanceTimersByTime(600000);

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

  describe('#all', () => {
    const reminders = [
      { app: 'appA', user: 'user 1', message: 'message 1' },
      { app: 'appB', user: 'user 2', message: 'message 2' }
    ]
    const RemindersRepo = memoizeFn(() => ({all: () => Promise.resolve(reminders)}))

    it('just delegates to the repo', async () => {
      const remindersService = Subject(RemindersRepo())
      const all = await remindersService.all()

      expect(all).toEqual(reminders)
    })
  })

  describe('#find', () => {
    const reminder = { app: 'appB', user: 'user 2', message: 'message 2' }

    const RemindersRepo = memoizeFn(() => ({
      find: (name) =>
        name === 'appB' ? Promise.resolve(reminder) : Promise.reject()
    }))

    it('just delegates to the repo', async () => {
      const remindersService = Subject(RemindersRepo())
      const app = await remindersService.find('appB')

      expect(app).toEqual(reminder)
    })
  })

  describe('#recoverPersistedReminders', () => {
    // After a restart, persisted reminders need to be reinstated as their timeouts
    // will have disappeared after the shutdown.
    const reminders = [
      { app: 'appA', user: 'user 1', message: 'message 1' },
      { app: 'appB', user: 'user 2', message: 'message 2' }
    ]
    const RemindersRepo = memoizeFn(() => ({all: () => Promise.resolve(reminders)}))

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
