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

  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllTimers()
  })

  describe('ListApps', () => {
    let listApps = null

    beforeEach(async () => {
      await Context.reset()
      await Context.appsService.add({name: 'appA'}, {name: 'appB'})

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
      await addApp({app: {name: 'appA'}})
      const apps = await Context.appsService.list()

      expect(apps).toEqual(arrayContaining([
        { id: 'appA', name: 'appA' }
      ]))
    })

    it('does not add an existing app', async () => {
      await Context.appsService.add({ name: 'appA' })

      try {
        await addApp({app: {name: 'appA'}})
        fail('Expected to fail')
      } catch(error) {
        expect(error).toBeInstanceOf(AppAlreadyExists)
      }
    })
  })

  describe('RemoveApp', () => {
    let removeApp = null

    beforeEach(async () => {
      await Context.reset()

      removeApp = Context.buildFn(features.RemoveApp)
    })

    it('removes an app', async () => {
      await Context.appsService.add({name: 'appA'}, {name: 'appB'})

      await removeApp({app: 'appA'})
      const apps = await Context.appsService.list()

      expect(apps).toEqual([{id: 'appB', name: 'appB'}])
    })

    it('does not remove a non-existing app', async () => {
      await Context.appsService.add({ name: 'appB' })

      try {
        await removeApp({app: 'appA'})
        fail('Expected to fail')
      } catch(error) {
        expect(error).toBeInstanceOf(AppDoesNotExist)
      }
    })

    it('removes any existing reminders for the app being removed', async () => {
      await Context.appsService.add({name: 'appA'}, {name: 'appB'})
      await Context.remindersService.add({app: 'appA', user: 'somedude', message: 'random'})

      await removeApp({app: 'appA'})
      const reminder = await Context.remindersService.find('appA')

      expect(reminder).toBeUndefined()
    })

    it('notifies that app has been removed', async () => {
      await Context.appsService.add({name: 'appA'}, {name: 'appB'})
      await removeApp({app: 'appA'})

      const notifications = Context.notifier.teamNotifications
      expect(notifications.length).toEqual(1)
      expect(notifications[0].message).toMatch('`appA` has been removed')
    })
  })

  describe('ShowStatus', () => {
    let showStatus

    beforeEach(async () => {
      await Context.reset()
      await Context.appsService.add({name: 'appA'}, {name: 'appB'})
      await Context.takeApp({ app: 'appA', user: 'jack' })

      showStatus = Context.buildFn(features.ShowStatus)
    })

    it('shows the status for all configured apps', async () => {
      const { status } = await showStatus()
      expect(status).toEqual(arrayContaining([
        {
          id: 'appA',
          message: '⛔ taken by jack',
          status: 'taken',
          user: 'jack',
        },{
          id: 'appB',
          message: '✅ is free',
          status: 'free',
        }
      ]))
    })
  })

  describe('TakeApp', () => {
    let takeApp = null

    beforeEach(async () => {
      await Context.reset()
      await Context.appsService.add({name: 'appA'}, {name: 'appB'})

      takeApp = Context.buildFn(features.TakeApp)
    })

    it('allows a user to take an app', async () => {
      await takeApp({app: 'appA', user: 'ivo'})
      const holder = await Context.appsService.holder('appA')
      expect(holder).toEqual('ivo')
    })

    it('sets up a reminder', async () => {
      await takeApp({app: 'appA', user: 'ivo'})
      const expectedMessage = Context.messages.areYouDoneWith('appA')
      const reminder = await Context.remindersRepo.find('appA')

      jest.runOnlyPendingTimers()

      expect(reminder).toMatchObject({app: 'appA', user: 'ivo', message: Context.messages.areYouDoneWith('appA')})
      expect(Context.notifier.userNotifications).toContainEqual({user: 'ivo', message: expectedMessage})
    })

    it('notifies about the app being taken', async () => {
      await takeApp({app: 'appA', user: 'ivo'})
      const notifications = Context.notifier.teamNotifications
      expect(notifications.length).toEqual(1)
      expect(notifications[0].message).toMatch('ivo has taken `appA`')
    })

    it('when an app does not exist, fails and warns the app does not exist', async () => {
      try {
        await takeApp({app: 'appZ', user: 'ivo'})
        fail('Expected to fail')
      } catch(error) {
        expect(error).toBeInstanceOf(AppDoesNotExist)
      }
    })

    it('when an app is already taken, fails and warns the app is taken', async () => {
      try {
        await takeApp({app: 'appA', user: 'jack'})
        await takeApp({app: 'appA', user: 'ivo'})
        fail('Expected to fail')
      } catch(error) {
        expect(error).toBeInstanceOf(AppIsTaken)
      }
    })

    describe('when supplying a custom time lease', () => {
      it('only triggers notifications after the time lease expires', async () => {
        await takeApp({app: 'appA', user: 'ivo', lease: 600000})
        const expectedMessage = Context.messages.areYouDoneWith('appA')

        jest.advanceTimersByTime(600000 - 20);
        expect(Context.notifier.userNotifications).toBeEmpty()

        jest.advanceTimersByTime(20);
        expect(Context.notifier.userNotifications).toContainEqual({user: 'ivo', message: expectedMessage})
      })
    })
  })

  describe('ReturnApp', () => {
    let returnApp = null
    const takenApp = 'appA'
    const expectedUser = 'ivo'

    beforeEach(async () => {
      await Context.reset()
      await Context.appsService.add({name: 'appA'}, {name: 'appB'})

      returnApp = Context.buildFn(features.ReturnApp)

      await Context.appsService.take(takenApp, expectedUser)
      await Context.remindersService.add({
        app: takenApp,
        user: expectedUser,
        message: 'some random message'
      })
    })

    it('allows a user to return a taken app', async () => {
      const holder = await Context.appsService.holder(takenApp)
      expect(holder).toEqual(expectedUser)

      await returnApp({app: takenApp, user: expectedUser})
      const noholder = await Context.appsService.holder(takenApp)
      expect(noholder).toBeNull()
    })

    it('removes existing reminders for the taken app', async () => {
      await returnApp({app: takenApp, user: expectedUser})

      expect(await Context.remindersRepo.find(takenApp)).toBeUndefined()
    })

    it('notifies the team about app being returned', async () => {
      await returnApp({app: 'appA', user: 'ivo'})
      const notifications = Context.notifier.teamNotifications
      expect(notifications.length).toEqual(1)
      expect(notifications[0].message).toMatch('ivo has returned `appA`')
    })

    it('fails if the app does not exist', async () => {
      try {
        await returnApp({app: 'appZ', user: expectedUser})
        fail('Expected to fail')
      } catch(error) {
        expect(error).toBeInstanceOf(AppDoesNotExist)
      }
    })

    it('fails if the app is not taken', async () => {
      try {
        await returnApp({app: 'appB', user: expectedUser})
        fail('Expected to fail')
      } catch(error) {
        expect(error).toBeInstanceOf(AppIsNotTaken)
      }
    })

    it('fails if the app is taken by a different user', async () => {
      try {
        await returnApp({app: takenApp, user: 'marco'})
        fail('Expected to fail')
      } catch(error) {
        expect(error).toBeInstanceOf(AppIsTakenByOtherUser)
      }
    })
  })
})
