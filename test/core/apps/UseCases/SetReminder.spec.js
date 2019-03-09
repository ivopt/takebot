import SetReminder from '#/src/core/apps/UseCases/SetReminder'
import ITakeNotifier from '#/src/core/ITakeNotifier'
import IRemindersRepo from '#/src/core/reminders/IRemindersRepo'

class MockedNotifier extends ITakeNotifier {
  constructor(notifyUserMock) {
    super()
    this.notifyUser = notifyUserMock
  }
}

class MockedRemindersRepo extends IRemindersRepo {
  add = (_app, id) => { this.remindId = id; return Promise.resolve() }
  find = (_app) => { return Promise.resolve(this.remindId) }
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
    const { reminderId } = await setReminder({user: 'theuser', app: 'theapp'})
    const storedReminderId = await mockedRemindersRepo.find('theapp')
    expect(reminderId).toEqual(storedReminderId)
  })

  // Not sure how to deal with this without introducing "stuff" to production code..
  it.skip('reminds the user about the app', async () => {
    const { remindPromise } = await setReminder({user: 'theuser', app: 'theapp'})

    await remindPromise
    expect(notifyUserMock).toBeCalledWith('theuser', 'Are you done with `theapp` ?')
  })
})
