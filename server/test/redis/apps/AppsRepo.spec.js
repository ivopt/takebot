import redis from '#/src/redis/PromiseRedis'
import AppsRepo from '#/src/redis/apps/AppsRepo'

const arrayContaining = expect.arrayContaining

describe('AppsRepo', () => {
  const AppsRepoKey = "TakeBot:apps"
  let redisClient
  let subject

  beforeAll(() => { redisClient = redis.createClient({url: process.env.REDIS_URL}) })
  afterAll(() => { redisClient.quit() })

  afterEach(async () => await redisClient.flushdb())
  beforeEach(() => { subject = new AppsRepo(redisClient, "TakeBot") })

  describe('#list', () => {
    it('returns the list of apps given', async () => {
      await redisClient.hset(AppsRepoKey, 'appA', JSON.stringify({id: 'appA'}))
      await redisClient.hset(AppsRepoKey, 'appB', JSON.stringify({id: 'appB'}))

      const list = await subject.list()
      expect(list).toEqual(arrayContaining([{id: 'appA'}, {id: 'appB'}]))
    })
  })

  describe('#add', () => {
    it('adds an app to the repo', async () => {
      await subject.add({name: 'appZZ'})
      expect(await subject.list()).toContainEqual({id: 'appZZ', name: 'appZZ'})
    })

    it('adds multiple apps to the repo', async () => {
      await subject.add({name: 'appZZ'}, {name: 'appXX'})
      const list = await subject.list()
      expect(list).toContainEqual({id: 'appZZ', name: 'appZZ'})
      expect(list).toContainEqual({id: 'appXX', name: 'appXX'})
    })

    it('adding an already existing app takes no effect', async () => {
      await subject.add({name: 'appYY'})
      await subject.add({name: 'appYY'})

      const applist = (await subject.list()).filter(a => a.id == 'appYY')
      expect(applist.length).toEqual(1)
    })
  })

  describe('#remove', () => {
    it('removes an app from the repo', async () => {
      await subject.add({name: 'appA'})
      const listBefore = await subject.list()
      expect(listBefore.map(a => a.name)).toContainEqual('appA')

      await subject.remove('appA')
      const listAfter = await subject.list()
      expect(listAfter.map(a => a.name)).not.toContainEqual('appA')
    })

    it('removes multiple apps from the repo', async () => {
      await subject.add({name: 'appA'}, {name: 'appB'}, {name: 'appC'})
      const listBefore = await subject.list()
      expect(listBefore.map(a => a.name)).toIncludeAllMembers(['appA', 'appB', 'appC'])

      await subject.remove('appA', 'appB')
      const listAfter = await subject.list()
      expect(listAfter.map(a => a.name)).not.toIncludeAllMembers(['appA', 'appB'])
      expect(listAfter.map(a => a.name)).toContainEqual('appC')
    })

    it('removing a non existing app takes no effect', async () => {
      const listBefore = await subject.list()
      await subject.remove('appA')
      const listAfter = await subject.list()

      expect(listAfter).toEqual(listBefore)
    })
  })

  describe('#exist', () => {
    it('returns true if a given app exists', async () => {
      await redisClient.hset(AppsRepoKey, 'appA', JSON.stringify({id: 'appA', name: 'appA'}))

      expect(await subject.exist('appA')).toBeTruthy()
    })

    it('returns false if a given app does not exist', async () => {
      expect(await subject.exist('appA')).toBeFalsy()
    })
  })
})
