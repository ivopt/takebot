import Context from '#/test/support/TestContext'
import ShowStatus from '#/src/core/apps/features/ShowStatus'

const arrayContaining = expect.arrayContaining

describe('ShowStatus', () => {
  let showStatus

  beforeEach(async () => {
    await Context.reset()
    await Context.appsService.add({name: "appA"}, {name: "appB"})
    await Context.takeApp({ app: "appA", user: "jack" })

    showStatus = Context.buildFn(ShowStatus)
  })

  afterAll(async () => {
    await Context.reset()
    Context.exit()
  })

  it('', async () => {
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
