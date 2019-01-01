import Context from '#/test/support/TestContext'
import TakeApp from '#/src/core/apps/features/TakeApp'

describe('TakeApp', () => {
  let takeApp = null

  beforeAll(() => {
    Context.appsRepo.setApps(["appA", "appB"])

    takeApp = TakeApp({
      appsRepo: Context.appsRepo,
      remindersRepo: Context.remindersRepo,
      notifier: Context.notifier,
      remindIn: 1
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
    expect(reminderId).toBeDefined()
  })

  it('notifies about the app being taken', async () => {
    await takeApp("appA", "ivo")
    const notifications = Context.notifier.teamNotifications
    expect(notifications.length).toEqual(1)
    expect(notifications[0].message).toEqual("ivo has taken `appA`")
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
