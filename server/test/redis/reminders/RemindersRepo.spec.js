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
      redisClient.hset(
        `${rootKey}:reminder`, 'appA', JSON.stringify({app: 'appA', user: 'ivo', message: '123'}))
      redisClient.hset(
        `${rootKey}:reminder`, 'appB', JSON.stringify({app: 'appB', user: 'ivo', message: '234'}))

      const all = await remindersRepo.all()
      expect(all).toMatchObject({
        'appA': {app: 'appA', user: 'ivo', message: '123'},
        'appB': {app: 'appB', user: 'ivo', message: '234'}
      })
    })
  })

  describe('#find', () => {
    it('finds an app reminder by the app name', async () => {
      const reminderData = {app: 'appC', user: 'ivo', message: 'aaa'}
      redisClient.hset(`${rootKey}:reminder`, 'appA', JSON.stringify(reminderData))

      expect(await remindersRepo.find("appA")).toEqual(reminderData)
    })

    it('returns undefined if Reminder not set', async () => {
      expect(await remindersRepo.find('noApp')).toBeUndefined()
    })
  })

  describe('#add', () => {
    it('adds a reminder to for an app', async () => {
      await remindersRepo.add('appC', {user: 'ivo', message: 'aaa'})

      expect(
        await redisClient.hget(`${rootKey}:reminder`, 'appC')
                         .then(JSON.parse)
      ).toEqual({app: 'appC', user: 'ivo', message: 'aaa'})
    })

    it('fails if the reminder already exists', async () => {
      await remindersRepo.add('appC', {user: 'ivo', message: 'aaa'})

      try {
        await remindersRepo.add('appC', {user: 'ivo', message: 'aaa'})
        fail("Expecting to throw and it didn't")
      } catch(error) {
        expect(error).toEqual('Reminder is already set')
      }
    })
  })

  describe('#remove', () => {
    it('removes a reminder for an app', async () => {
      await redisClient.hset(`${rootKey}:reminder`, 'appC', JSON.stringify({what: 'ever'}))
      await remindersRepo.remove('appC')
      expect(await redisClient.hget(`${rootKey}:reminder`, 'appC')).toBeNull()
    })

    it('no errors are raised if app reminder does not exist', async () => {
      await redisClient.hset(`${rootKey}:reminder`, 'appC', JSON.stringify({what: 'ever'}))
      try {
        await remindersRepo.remove('appZ')
      } catch(e) {
        fail("No exceptions should have been raised!")
      }
    })
  })
})
