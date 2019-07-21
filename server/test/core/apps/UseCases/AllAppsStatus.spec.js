import AllAppsStatus from '#/src/core/apps/UseCases/AllAppsStatus'

describe('AllAppsStatus', () => {
  const existingApps = ['appA', 'appB']

  const mockedAppRepo = {
    list: () => Promise.resolve(existingApps),
    takenApps: () => Promise.resolve({'appA': 'jack'})
  }

  const messages = {
    appTakenBy: (user) => `taken by ${user}`,
    appIsFree: () => 'is free'
  }

  const allAppsStatus = AllAppsStatus(mockedAppRepo, messages)

  it('includes the status of all known apps', async () => {
    const { status } = await allAppsStatus()
    expect(Object.keys(status)).toEqual(existingApps)
  })

  it('taken apps use the `appTakenBy` message and the user who took it', async () => {
    const { status } = await allAppsStatus()
    expect(status['appA'].message).toEqual(messages.appTakenBy('jack'))
    expect(status['appA'].user).toEqual('jack')
  })

  it('free apps use the `appIsFree` message', async () => {
    const { status } = await allAppsStatus()
    expect(status['appB'].message).toEqual(messages.appIsFree())
  })

  it('has a message for each app, given its status', async () => {
    const { status } = await allAppsStatus()
    expect(status).toEqual({
      appA: {
        message: messages.appTakenBy('jack'),
        status: "taken",
        user: "jack",
      },
      appB: {
        message: messages.appIsFree(),
        status: "free",
      }
    })
  })
})
