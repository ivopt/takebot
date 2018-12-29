import redis from '#/src/redis/PromiseRedis'
import AppsRepo from '#/src/redis/apps/AppsRepo'

describe('AppsRepo', () => {
  const AppsRepoKey = "TakeBot"
  const TakenAppsKey = `${AppsRepoKey}:taken`
  let apps = ["appA", "appB"]
  let redisClient
  let subject

  beforeAll(() => { redisClient = redis.createClient({url: process.env.REDIS_URL}) })
  afterAll(() => { redisClient.quit() })

  afterEach(async () => {
    const keys = await redisClient.keys(`${AppsRepoKey}*`)
    keys.forEach(async key => await redisClient.del(key))
  })

  beforeEach(() => { subject = new AppsRepo(redisClient, apps) })

  describe('#list', () => {
    it('returns the list of apps given', async () => {
      expect(await subject.list()).toEqual(apps)
    })
  })

  describe('#take', () => {
    const app = "appA"
    const expectedUser = "TheUserThatTookIt"

    it('sets an app as taken by the given user', async () => {
      await subject.take(app, expectedUser)
      const user = await redisClient.hget(TakenAppsKey, app)
      expect(user).toEqual(expectedUser)
    })
  })

  describe('#release', () => {
    const app = "appA"
    const expectedUser = "TheUserThatTookIt"

    beforeEach(async () => await redisClient.hset(TakenAppsKey, app, expectedUser))

    it('releases the app', async () => {
      await subject.release(app)
      const user = await redisClient.hget(TakenAppsKey, app)
      expect(user).toBeNull()
    })
  })

  describe('#holder', () => {
    const app = "appA"
    const user = "TheUserThatIsHoldingTheApp"
    beforeEach(async () => await redisClient.hset(TakenAppsKey, app, user))
    afterEach(async () => await redisClient.hdel(TakenAppsKey, app, user))

    it('returns the holder of an app', async () => {
      expect(await subject.holder("appA")).toEqual(user)
    })

    describe('when app is not taken', () => {
      beforeEach(async () => await redisClient.hdel(TakenAppsKey, app, user))

      it('returns null', async () => {
        expect(await subject.holder("appA")).toBeNull()
      })
    })
  })

  describe('#status', () => {
    beforeEach(async () => {
      await redisClient.hset(TakenAppsKey, "app1", "user1")
      await redisClient.hset(TakenAppsKey, "app2", "user3")
      await redisClient.hset(TakenAppsKey, "app3", "user3")
      await redisClient.hset(TakenAppsKey, "app4", "user2")
    })

    it('', async () => {
      const status =
      expect(await subject.status()).toMatchObject({
        "app1": "user1",
        "app2": "user3",
        "app3": "user3",
        "app4": "user2",
      })
    })
  })
})
