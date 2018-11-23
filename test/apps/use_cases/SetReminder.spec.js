import SetReminder from '../../../src/apps/use_cases/SetReminder'

describe('SetReminder', () => {
  const mockedAppRepo = {
    remind: () => Promise.resolve(''),
  }

  const mockedSlackBot = () => ({
    warnUser: (user) => user
  })

  const setReminder = SetReminder(mockedAppRepo, mockedSlackBot, delay)
  it('should return  ')
})
