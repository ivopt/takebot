import Context from '#/test/support/TestContext'
import features from '#/src/core/features'
import {
  AppAlreadyExists,
  AppIsTaken,
  AppDoesNotExist,
  AppIsNotTaken,
  AppIsTakenByOtherUser
} from '#/src/core/apps/Errors'

const arrayContaining = expect.arrayContaining

describe('features', () => {
  afterAll(async () => {
    await Context.reset()
    Context.exit()
  })

  describe('ListApps', () => {
    let listApps = null

    beforeEach(async () => {
      await Context.reset()
      await Context.appsRepo.add({name: "appA"}, {name: "appB"})

      listApps = Context.buildFn(features.ListApps)
    })

    it('lists all existing apps ordered by name', async () => {
      const { apps } = await listApps()
      expect(apps).toEqual(arrayContaining([
        { id: 'appA', name: 'appA'},
        { id: 'appB', name: 'appB'}
      ]))
    })
  })

  describe('AddApp', () => {
    let addApp = null

    beforeEach(async () => {
      await Context.reset()

      addApp = Context.buildFn(features.AddApp)
    })

    it('adds an app to the app list', async () => {
      await addApp({name: 'appA'})
      const apps = await Context.appsRepo.list()

      expect(apps).toEqual(arrayContaining([
        { id: 'appA', name: 'appA' }
      ]))
    })

    it('does not add an existing app', async () => {
      await Context.appsRepo.add({ name: 'appA' })

      try {
        await addApp({name: 'appA'})
        fail('Expected to fail')
      } catch(error) {
        expect(error).toBeInstanceOf(AppAlreadyExists)
      }
    })
  })

  describe('ShowStatus', () => {
    let showStatus

    beforeEach(async () => {
      await Context.reset()
      await Context.appsRepo.add({name: "appA"}, {name: "appB"})
      await Context.takeApp("appA", "jack")

      showStatus = Context.buildFn(features.ShowStatus)
    })

    it('shows the status for all configured apps', async () => {
      const { status } = await showStatus()
      expect(status).toEqual(arrayContaining([
        {
          id: 'appA',
          message: "⛔ taken by jack",
          status: "taken",
          user: "jack",
        },{
          id: 'appB',
          message: "✅ is free",
          status: "free",
        }
      ]))
    })
  })

  describe('TakeApp', () => {
    let takeApp = null

    beforeEach(async () => {
      await Context.reset()
      await Context.appsRepo.add({name: "appA"}, {name: "appB"})

      takeApp = Context.buildFn(features.TakeApp, {remindIn: 1})
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

  describe('ReturnApp', () => {
    let returnApp = null
    const takenApp = "appA"
    const expectedUser = "ivo"
    const expectedReminderId = 1234

    beforeEach(async () => {
      await Context.reset()
      await Context.appsRepo.add({name: "appA"}, {name: "appB"})

      returnApp = Context.buildFn(features.ReturnApp)

      await Context.appsRepo.take(takenApp, expectedUser)
      await Context.remindersRepo.add(takenApp, expectedReminderId)
    })

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
      expect(notifications[0].message).toMatch("ivo has returned `appA`")
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
})
