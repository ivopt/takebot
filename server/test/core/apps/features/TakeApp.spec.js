import Context from '#/test/support/TestContext'
import TakeApp from '#/src/core/apps/features/TakeApp'
import { AppDoesNotExist, AppIsTaken } from '#/src/core/apps/Errors'

describe('TakeApp', () => {
  let takeApp = null

  beforeEach(async () => {
    await Context.reset()
    await Context.appsService.add({name: "appA"}, {name: "appB"})

    takeApp = Context.buildFn(TakeApp, {remindIn: 1})
  })

  afterAll(async () => {
    await Context.reset()
    Context.exit()
  })

  it('only works with the right context', async () => {
    try {
      await takeApp({})
      fail('Should not have reached here')
    } catch(error) {
      expect(error).toMatch("Missing context")
    }
  })

  it('allows a user to take an app', async () => {
    await takeApp({app: "appA", user: "ivo"})
    const holder = await Context.appsService.holder("appA")
    expect(holder).toEqual("ivo")
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
})
