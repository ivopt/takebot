import SetReminder from '~/src/core/apps/UseCases/SetReminder'

describe('SetReminder', () => {
  const remindInterval = 100
  const intervalFn = (f, time) => f(time)
  const mockedRemindersRepo = { add: jest.fn() }
  const mockedSlackBot = { remindUserToRelease: jest.fn() }

  const setReminder = SetReminder(
    remindInterval,
    intervalFn,
    mockedRemindersRepo,
    mockedSlackBot
  )

  it('', async () => {
    const { reminderId } = await setReminder({user: 'theuser', app: 'theapp'})
  })
})
