import CheckIfAppExists from '~/src/core/apps/UseCases/CheckIfAppExists'

describe('CheckIfAppExists', () => {
  const mockedAppRepo = {
    list: () => Promise.resolve(["appA", "appB"])
  }
  const checkIfAppExists = CheckIfAppExists(mockedAppRepo)

  it('when app exists, returns the context given', async () => {
    const originalCtx = { app: 'appB', something: 'else' }
    const ctx = await checkIfAppExists(originalCtx)
    expect(ctx).toEqual(originalCtx)
  })

  it('when app does not exist, fails with error message', (done) => {
    checkIfAppExists({ app: 'appC' }).catch((error) => {
      expect(error).toEqual('App does not exist')
      done()
    })
  })
})
