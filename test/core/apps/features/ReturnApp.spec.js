import Context from '#/test/support/TestContext'
import ReturnApp from '#/src/core/apps/features/ReturnApp'
import {
  AppDoesNotExist,
  AppIsNotTaken,
  AppIsTakenByOtherUser
} from '#/src/core/apps/Errors'

describe('ReturnApp', () => {
  let returnApp = null
  const takenApp = "appA"
  const expectedUser = "ivo"
  const expectedReminderId = 1234

  beforeAll(() => {
    Context.appsRepo.setApps(["appA", "appB"])

    returnApp = ReturnApp({
      appsRepo: Context.appsRepo,
      remindersRepo: Context.remindersRepo,
      notifier: Context.notifier,
      messages: Context.messages
    })
  })

  beforeEach(async () => {
    await Context.appsRepo.take(takenApp, expectedUser)
    await Context.remindersRepo.add(takenApp, expectedReminderId)
  })

  afterAll(() => { Context.exit() })
  afterEach(() => { Context.reset() })

  it('allows a user to return a taken app', async () => {
    const holder = await Context.appsRepo.holder(takenApp)
    expect(holder).toEqual(expectedUser)

    await returnApp(takenApp, expectedUser)
    const noholder = await Context.appsRepo.holder(takenApp)
    expect(noholder).toBeNull()
  })

  it('removes existing reminders for the taken app', async () => {
    const existingReminderId = await Context.remindersRepo.find(takenApp)
    expect(existingReminderId).toEqual(expectedReminderId)

    await returnApp(takenApp, expectedUser)

    const noReminderId = await Context.remindersRepo.find(takenApp)
    expect(noReminderId).toBeUndefined()
  })

  it('notifies the team about app being returned', async () => {
    await returnApp("appA", "ivo")
    const notifications = Context.notifier.teamNotifications
    expect(notifications.length).toEqual(1)
    expect(notifications[0].message).toEqual("ivo has returned `appA`")
  })

  it('fails if the app does not exist', async () => {
    try {
      await returnApp('appZ', expectedUser)
      fail('Expected to fail')
    } catch(error) {
      expect(error).toBeInstanceOf(AppDoesNotExist)
    }
  })

  it('fails if the app is not taken', async () => {
    try {
      await returnApp('appB', expectedUser)
      fail('Expected to fail')
    } catch(error) {
      expect(error).toBeInstanceOf(AppIsNotTaken)
    }
  })

  it('fails if the app is taken by a different user', async () => {
    try {
      await returnApp(takenApp, 'marco')
      fail('Expected to fail')
    } catch(error) {
      expect(error).toBeInstanceOf(AppIsTakenByOtherUser)
    }
  })
})
