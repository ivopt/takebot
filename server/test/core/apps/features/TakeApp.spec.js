import Context from '#/test/support/TestContext'
import TakeApp from '#/src/core/apps/features/TakeApp'
import { AppDoesNotExist, AppIsTaken } from '#/src/core/apps/Errors'

describe('TakeApp', () => {
  let takeApp = null

  beforeEach(async () => {
    await Context.reset()
    await Context.appsRepo.add({name: "appA"}, {name: "appB"})

    takeApp = Context.buildFn(TakeApp, {remindIn: 1})
  })

  afterAll(async () => {
    await Context.reset()
    Context.exit()
  })

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
    expect(notifications[0].message).toMatch("ivo has taken `appA`")
  })

  it('when an app does not exist, fails and warns the app does not exist', async () => {
    try {
      await takeApp('appZ', 'ivo')
      fail('Expected to fail')
    } catch(error) {
      expect(error).toBeInstanceOf(AppDoesNotExist)
    }
  })

  it('when an app is already taken, fails and warns the app is taken', async () => {
    try {
      await takeApp('appA', 'jack')
      await takeApp('appA', 'ivo')
      fail('Expected to fail')
    } catch(error) {
      expect(error).toBeInstanceOf(AppIsTaken)
    }
  })
})
