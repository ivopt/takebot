import SetReminder from '#/src/core/reminders/features/SetReminder'
import IRemindersRepo from '#/src/core/reminders/IRemindersRepo'

class MockedNotifier {
  constructor(notifyUserMock) {
    this.notifyUser = notifyUserMock
  }
}

class MockedRemindersRepo extends IRemindersRepo {
  add = (_app, { interval }) => { this.remindId = interval; return Promise.resolve() }
  find = (_app) => Promise.resolve(this.remindId)
}

describe('SetReminder', () => {
  const remindInterval = 1
  const notifyUserMock = jest.fn()
  const mockedRemindersRepo = new MockedRemindersRepo()
  const mockedNotifier = new MockedNotifier(notifyUserMock)

  const setReminder = SetReminder(
    remindInterval,
    mockedRemindersRepo,
    mockedNotifier
  )

  beforeEach(() => {
    notifyUserMock.mockReset()
  })

  it('sets a reminderId on the context', async () => {
    const { interval } = await setReminder({user: 'theuser', app: 'theapp'})
    const storedInterval = await mockedRemindersRepo.find('theapp')

    expect(interval).toEqual(storedInterval)
  })

  // Not sure how to deal with this without introducing "stuff" to production code..
  it.skip('reminds the user about the app', async () => {
    const { remindPromise } = await setReminder({user: 'theuser', app: 'theapp'})

    await remindPromise
    expect(notifyUserMock).toBeCalledWith('theuser', 'Are you done with `theapp` ?')
  })
})
