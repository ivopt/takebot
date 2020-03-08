import AllAppsStatus from '#/src/core/apps/UseCases/AllAppsStatus'

const arrayContaining = expect.arrayContaining

describe('AllAppsStatus', () => {
  const existingApps = [{ id: 'appA' }, { id: 'appB'}]

  const mockedAppsService = {
    status: () => Promise.resolve([
      {
        id: 'appA',
        message: "taken by jack",
        status: "taken",
        user: "jack",
      },{
        id: 'appB',
        message: "is free",
        status: "free",
      }
    ])
  }

  const messages = {
    appTakenBy: (user) => `taken by ${user}`,
    appIsFree: () => 'is free'
  }

  const allAppsStatus = AllAppsStatus(mockedAppsService, messages)

  it('includes the status of all known apps', async () => {
    const { status } = await allAppsStatus()
    const allIds = status.reduce((acc, {id}) => acc.concat(id), [])

    expect(allIds).toEqual(existingApps.map(a => a.id))
  })

  it('taken apps use the `appTakenBy` message and the user who took it', async () => {
    const { status } = await allAppsStatus()
    const appA = status.find(({id}) => id == 'appA')

    expect(appA.message).toEqual(messages.appTakenBy('jack'))
    expect(appA.user).toEqual('jack')
  })

  it('free apps use the `appIsFree` message', async () => {
    const { status } = await allAppsStatus()
    const appB = status.find(({id}) => id == 'appB')

    expect(appB.message).toEqual(messages.appIsFree())
  })

  it('has a message for each app, given its status', async () => {
    const { status } = await allAppsStatus()

    expect(status).toEqual(arrayContaining([
      {
        id: 'appA',
        message: messages.appTakenBy('jack'),
        status: "taken",
        user: "jack",
      },{
        id: 'appB',
        message: messages.appIsFree(),
        status: "free",
      }
    ]))
  })
})
