import Context from '#/test/support/TestContext'
import ReturnApp from '#/src/core/apps/features/ReturnApp'
import {
  AppDoesNotExist,
  AppIsNotTaken,
  AppIsTakenByOtherUser
} from '#/src/core/apps/Errors'

describe('ReturnApp', () => {
  let returnApp = null
  const takenApp = 'appA'
  const expectedUser = 'ivo'
  const expectedReminderId = 1234

  beforeEach(async () => {
    await Context.reset()
    await Context.appsRepo.add({name: 'appA'}, {name: 'appB'})

    returnApp = Context.buildFn(ReturnApp)

    await Context.appsRepo.take(takenApp, expectedUser)
    await Context.remindersRepo.add(takenApp, expectedReminderId)
  })

  afterAll(async () => {
    await Context.reset()
    Context.exit()
  })

  it('allows a user to return a taken app', async () => {
    const holder = await Context.appsRepo.holder(takenApp)
    expect(holder).toEqual(expectedUser)

    await returnApp({app: takenApp, user: expectedUser})
    const noholder = await Context.appsRepo.holder(takenApp)
    expect(noholder).toBeNull()
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
