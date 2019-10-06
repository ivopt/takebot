import Context from '#/test/support/TestContext'
import ListApps from '#/src/core/apps/features/ListApps'

const arrayContaining = expect.arrayContaining

describe('ListApps', () => {
  let listApps = null

  beforeEach(async () => {
    await Context.reset()
    await Context.appsRepo.add({name: "appA"}, {name: "appB"})

    listApps = Context.buildFn(ListApps)
  })

  afterAll(async () => {
    await Context.reset()
    Context.exit()
  })

  it('lists all existing apps ordered by name', async () => {
    const { apps } = await listApps()
    expect(apps).toEqual(arrayContaining([
      { id: 'appA', name: 'appA'},
      { id: 'appB', name: 'appB'}
    ]))
  })
})
