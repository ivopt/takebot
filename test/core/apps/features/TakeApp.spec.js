import Context from '../../../support/TestContext'
import TakeApp from '../../../../src/core/apps/features/TakeApp'

describe('TakeApp', () => {
  let takeApp = null

  beforeAll(() => {
    takeApp = TakeApp({
      appsRepo: Context.appsRepo,
      remindersRepo: Context.remindersRepo,
      slackBot: Context.slackBot,
      remindIn: 1,
      delayFn: jest.fn()
    })
  })

  afterAll(() => {
    Context.redisClient.quit()
  })

  it('', () => {
    expect(1).toBe(2)
  })
})
