import AppsService from '#/src/core/apps/AppsService'
import IAppsRepo from '#/src/core/apps/IAppsRepo'
import ITakenAppsRepo from '#/src/core/apps/ITakenAppsRepo'
import { AppDoesNotExist } from '#/src/core/apps/Errors'

import { memoizedMockImpl } from '#/test/support/MockInterfaces'

describe('AppsService', () => {
  const AppsRepo = memoizedMockImpl(IAppsRepo)
  const TakenAppsRepo = memoizedMockImpl(ITakenAppsRepo)

  const Subject = (
    appsRepo = AppsRepo(),
    takenAppsRepo = TakenAppsRepo()
  ) => new AppsService(appsRepo, takenAppsRepo)

  beforeEach(() => { jest.useFakeTimers() })

  describe('delegates add, remove, list and exist to AppsRepo', () => {
    it('delegates #add to appsRepo', async () => {
      await Subject().add('one', 'two')
      expect(AppsRepo().add).toBeCalledWith('one', 'two')
    })

    it('delegates #remove to appsRepo', async () => {
      await Subject().remove('one', 'two')
      expect(AppsRepo().remove).toBeCalledWith('one', 'two')
    })

    it('delegates #list to appsRepo', async () => {
      await Subject().list()
      expect(AppsRepo().list).toBeCalled()
    })

    it('delegates #exist to appsRepo', async () => {
      await Subject().exist('one')
      expect(AppsRepo().exist).toBeCalledWith('one')
    })
  })

  describe('#take', () => {
    it('given an existing app, takes it for the given user', async () => {
      const appsService = Subject({exist: (_app) => Promise.resolve(true)})
      await appsService.take('appA', 'jack')
      expect(TakenAppsRepo().take).toBeCalledWith('appA', 'jack')
    })

    it('if app does not exist, raises AppDoesNotExist', async () => {
      const appsService = Subject({exist: (_app) => Promise.resolve(false)})
      try {
        await appsService.take('appA', 'jack')
        fail('Should have failed!')
      } catch(error) {
        expect(error).toBeInstanceOf(AppDoesNotExist)
      }
    })
  })

  it('delegates release to TakenAppsRepo', async () => {
    await Subject().release('appA')
    expect(TakenAppsRepo().release).toBeCalledWith('appA')
  })

  it('delegates holder to TakenAppsRepo', async () => {
    await Subject().holder('appA')
    expect(TakenAppsRepo().holder).toBeCalledWith('appA')
  })

  describe('#status', () => {
    const appList = [{id: 'appA'}, {id: 'appB'}, {id: 'appC'}]
    const takenApps = {
      'appA': 'jack',
      'appC': 'jill'
    }

    it('returns a status of all apps', async () => {
      const appsService = Subject(
        { list: () => Promise.resolve(appList) },
        { list: () => Promise.resolve(takenApps) }
      )

      const status = await appsService.status()
      expect(status).toEqual([
        {id: 'appA', status: 'taken', user: 'jack'},
        {id: 'appB', status: 'free', user: undefined},
        {id: 'appC', status: 'taken', user: 'jill'}
      ])
    })
  })
})
