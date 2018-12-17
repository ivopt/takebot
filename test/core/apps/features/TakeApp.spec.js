import Context from '../../../support/TestContext'
import TakeApp from '../../../../src/core/apps/features/TakeApp'

describe('TakeApp', () => {
  let takeApp = null

  beforeAll(() => {
    Context.appsRepo.setApps(["appA", "appB"])

    takeApp = TakeApp({
      appsRepo: Context.appsRepo,
      remindersRepo: Context.remindersRepo,
      slackBot: Context.slackBot,
      remindIn: 1,
      delayFn: jest.fn(() => 123)
    })
  })

  afterAll(() => { Context.exit() })
  afterEach(() => { Context.reset() })

  it('allows a user to take an app', async () => {
    await takeApp("appA", "ivo")
    const holder = await Context.appsRepo.holder("appA")
    expect(holder).toEqual("ivo")
  })

  it('sets up a reminder', async () => {
    await takeApp("appA", "ivo")
    const reminderId = await Context.remindersRepo.find("appA")
    expect(reminderId).toEqual(123)
  })

  it('when an app does not exist, fails and warns the app does not exist', async () => {
    try {
      await takeApp('appZ', 'ivo')
      fail('Expected to fail')
    } catch(error) {
      expect(error).toEqual('App does not exist')
    }
  })

  it('when an app is already taken, fails and warns the app is taken', async () => {
    try {
      await takeApp('appA', 'jack')
      await takeApp('appA', 'ivo')
      fail('Expected to fail')
    } catch(error) {
      expect(error).toEqual('App is already taken')
    }
  })
})
