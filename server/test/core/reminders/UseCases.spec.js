import { SetReminder} from '#/src/core/reminders/UseCases'
import Context from '#/test/support/TestContext'

describe('SetReminder', () => {
  afterAll(async () => {
    await Context.reset()
    Context.exit()
  })

  beforeEach(async () => {
    jest.useFakeTimers()
    jest.clearAllTimers()
    await Context.reset()
  })

  const ctx = {app: 'appA', user: 'someDude'}
  const expectedMessage = Context.messages.areYouDoneWith('appA')
  const setReminder = SetReminder(Context.remindersService, Context.messages)

  it('sets a new reminder', async () => {
    await setReminder({app: 'appA', user: 'someDude'})

    const savedReminder = await Context.remindersRepo.find('appA')

    expect(savedReminder).toEqual({...ctx, message: expectedMessage})
  })

  it('sets an Interval to notify the user', async () => {
    await setReminder({app: 'appA', user: 'someDude'})

    jest.runOnlyPendingTimers()

    expect(Context.notifier.userNotifications).toContainEqual({user: 'someDude', message: expectedMessage})
  })
})
