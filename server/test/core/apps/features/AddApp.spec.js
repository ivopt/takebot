import Context from '#/test/support/TestContext'
import AddApp from '#/src/core/apps/features/AddApp'
import { AppAlreadyExists } from '#/src/core/apps/Errors'

const arrayContaining = expect.arrayContaining

describe('AddApp', () => {
  let addApp = null

  beforeEach(async () => {
    await Context.reset()

    addApp = Context.buildFn(AddApp)
  })

  afterAll(async () => {
    await Context.reset()
    Context.exit()
  })

  it('adds an app to the app list', async () => {
    await addApp({app: {name: 'appA'}})
    const apps = await Context.appsRepo.list()

    expect(apps).toEqual(arrayContaining([
      { id: 'appA', name: 'appA' }
    ]))
  })

  it('does not add an existing app', async () => {
    await Context.appsRepo.add({ name: 'appA' })

    try {
      await addApp({app: {name: 'appA'}})
      fail('Expected to fail')
    } catch(error) {
      expect(error).toBeInstanceOf(AppAlreadyExists)
    }
  })
})
