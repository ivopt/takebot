import CheckIfAppIsFree from '#/src/core/apps/UseCases/CheckIfAppIsFree'
import { AppIsTaken } from '#/src/core/apps/Errors'

describe('CheckIfAppIsFree', () => {
  describe('when app is not taken', () => {
    const mockedAppRepo = {
      holder: () => Promise.resolve(null)
    }
    const checkIfAppIsFree = CheckIfAppIsFree(mockedAppRepo)

    it('returns the context given', async () => {
      const originalCtx = { app: 'appB', something: 'else' }
      const ctx = await checkIfAppIsFree(originalCtx)
      expect(ctx).toEqual(originalCtx)
    })
  })

  describe('when app is taken', () => {
    const mockedAppRepo = {
      holder: (_app) => Promise.resolve("Jane Doe")
    }
    const checkIfAppIsFree = CheckIfAppIsFree(mockedAppRepo)

    it('fails with error message', async () => {
      expect.assertions(1)

      const ctx = { app: 'appC' }
      try {
        await checkIfAppIsFree(ctx)
      } catch(error) {
        expect(error instanceof AppIsTaken).toBeTruthy()
      }
    })
  })
})
