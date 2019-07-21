import Context from '#/test/support/TestContext'
import ShowStatus from '#/src/core/apps/features/ShowStatus'

describe('ShowStatus', () => {
  let showStatus

  beforeEach(async () => {
    await Context.reset()
    await Context.appsRepo.add("appA", "appB")
    await Context.takeApp("appA", "jack")

    showStatus = Context.buildFn(ShowStatus)
  })

  afterAll(async () => {
    await Context.reset()
    Context.exit()
  })

  it('', async () => {
    const { status } = await showStatus()
    expect(status).toEqual({
      "appA": Context.messages.appTakenBy("jack"),
      "appB": Context.messages.appIsFree()
    })
  })
})