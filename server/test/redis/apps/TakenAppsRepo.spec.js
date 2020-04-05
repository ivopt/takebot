import redis from '#/src/redis/PromiseRedis'
import TakenAppsRepo from '#/src/redis/apps/TakenAppsRepo'
import { AppIsTaken, AppIsNotTakenByUser } from '#/src/core/apps/Errors'

describe('TakenAppsRepo', () => {
  const TakenAppsRepoKey = "TakeBot:apps:taken"
  let redisClient = null
  let subject = null

  beforeAll(() => { redisClient = redis.createClient({url: process.env.REDIS_URL}) })
  afterAll(() => { redisClient.quit() })

  afterEach(async () => await redisClient.flushdb())
  beforeEach(() => { subject = new TakenAppsRepo(redisClient, "TakeBot") })

  describe('#holder', () => {
    const app = "appA"
    const user = "TheUserThatIsHoldingTheApp"
    beforeEach(async () => await redisClient.hset(TakenAppsRepoKey, app, user))
    afterEach(async () => await redisClient.hdel(TakenAppsRepoKey, app, user))

    it('returns the holder of an app', async () => {
      expect(await subject.holder("appA")).toEqual(user)
    })

    describe('when app is not taken', () => {
      it('returns null', async () => {
        expect(await subject.holder("appB")).toBeNull()
      })
    })
  })

  describe('#take', () => {
    const app = "appA"
    const expectedUser = "TheUserThatTookIt"

    it('sets an app as taken by the given user', async () => {
      await subject.take(app, expectedUser)
      const user = await subject.holder(app)
      expect(user).toEqual(expectedUser)
    })

    it('raises an AppIsTaken error when app is already taken', async () => {
      await subject.take(app, 'someUser')
      try {
        await subject.take(app, 'anotherUser')
        fail('Should have raised!')
      } catch (error) {
        expect(error).toBeInstanceOf(AppIsTaken)
      }
    })
  })

  describe('#release', () => {
    const app = "appA"
    const expectedUser = "TheUserThatTookIt"

    beforeEach(async () => await subject.take(app, expectedUser))

    it('releases the app', async () => {
      await subject.release(app, expectedUser)
      expect(await subject.holder(app)).toBeNull()
    })
  })

  describe('#list', () => {
    it('reports all taken apps', async () => {
      await subject.take("app1", "user1")
      await subject.take("app2", "user3")
      await subject.take("app3", "user3")
      await subject.take("app4", "user2")

      expect(await subject.list()).toMatchObject({
        "app1": "user1",
        "app2": "user3",
        "app3": "user3",
        "app4": "user2",
      })
    })

    it('when there are no taken apps, coalesces to an empty map', async () => {
      expect(await subject.list()).toMatchObject({})
    })
  })
})
