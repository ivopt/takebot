import Context from '#/test/support/TestContext'
import RemoveApp from '#/src/core/apps/features/RemoveApp'
import { AppDoesNotExist } from '#/src/core/apps/Errors'

describe('RemoveApp', () => {
  let removeApp = null

  beforeEach(async () => {
    await Context.reset()
    removeApp = Context.buildFn(RemoveApp)
  })

  afterAll(async () => {
    await Context.reset()
    Context.exit()
  })

  it('removes an app to the app list', async () => {
    await Context.appsService.add({name: 'appA'}, {name: 'appB'})

    await removeApp({app: 'appA'})
    const apps = await Context.appsService.list()

    expect(apps).toEqual([
      { id: 'appB', name: 'appB' }
    ])
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
})
