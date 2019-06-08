import redis from '#/src/redis/PromiseRedis'
import RemindersRepo from '#/src/redis/reminders/RemindersRepo'

describe('RemindersRepo', () => {
  const rootKey = 'TakeBot'
  let redisClient
  let remindersRepo

  beforeAll(() => { redisClient = redis.createClient({url: process.env.REDIS_URL}) })
  afterAll(() => { redisClient.quit() })

  afterEach(async () => {
    const keys = await redisClient.keys(`${rootKey}*`)
    keys.forEach(async key => await redisClient.del(key))
  })

  beforeEach(() => { remindersRepo = new RemindersRepo(redisClient, rootKey) })

  describe('#all', () => {
    it('when there are no reminders, returns an empty object', async () => {
      expect(await remindersRepo.all()).toEqual({})
    })

    it('gets all existing reminders', async () => {
      redisClient.hset(`${rootKey}:reminder`, 'appA', 123)
      redisClient.hset(`${rootKey}:reminder`, 'appB', 234)

      const all = await remindersRepo.all()
      expect(all).toMatchObject({'appA': 123, 'appB': 234})
    })
  })

  describe('#find', () => {
    it('finds an app reminder by the app name', async () => {
      redisClient.hset(`${rootKey}:reminder`, 'appA', 123)

      expect(await remindersRepo.find("appA")).toEqual(123)
    })

    it('returns undefined if Reminder not set', async () => {
      expect(await remindersRepo.find('noApp')).toBeUndefined()
    })
  })

  describe('#add', () => {
    it('adds a reminder to for an app', async () => {
      await remindersRepo.add('appC', 789)
      const reminderId = await redisClient.hget(`${rootKey}:reminder`, 'appC')
      expect(Number(reminderId)).toEqual(789)
    })

    it('fails if the reminder already exists', async () => {
      await remindersRepo.add('appC', 789)

      try {
        await remindersRepo.add('appC', 123)
        fail("Expecting to throw and it didn't")
      } catch(error) {
        expect(error).toEqual('Reminder is already set')
      }
    })
  })

  describe('#remove', () => {
    it('removes a reminder for an app', async () => {
      await redisClient.hset(`${rootKey}:reminder`, 'appC', 234)
      await remindersRepo.remove('appC')
      expect(await redisClient.hget(`${rootKey}:reminder`, 'appC')).toBeNull()
    })

    it('no errors are raised if app reminder does not exist', async () => {
      await redisClient.hset(`${rootKey}:reminder`, 'appC', 234)
      try {
        await remindersRepo.remove('appZ')
      } catch(e) {
        fail("No exceptions should have been raised!")
      }
    })
  })
})
