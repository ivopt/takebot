import TakeAppForUser from '~/src/core/apps/UseCases/TakeAppForUser'

describe('TakeAppForUser', () => {
  const takeMock = jest.fn()
  const mockedAppRepo = { take: takeMock }
  const takeAppForUser = TakeAppForUser(mockedAppRepo)

  it('returns the context', async () => {
    const originalContext = {app: 'appA', user: 'Jane'}
    const ctx = await takeAppForUser(originalContext)
    expect(ctx).toEqual(originalContext)
  })

  it('takes the app for the user...', async () => {
    await takeAppForUser({app: 'appA', user: 'Jane'})
    expect(takeMock).toBeCalledWith('appA', 'Jane')
  })
})
