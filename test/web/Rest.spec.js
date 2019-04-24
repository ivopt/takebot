import request from 'supertest'
import Rest from '#/src/web/Rest'
import Context from '#/test/support/TestContext'
import TestExpressApp from '#/test/support/TestExpressApp'

describe('Rest', () => {
  const config = {
    env: {
      'REST_VERIFICATION_TOKEN': 'banana'
    }
  }
  const validAuth = 'basic: banana'
  const server = () => TestExpressApp().use(Rest(Context, config))

  const helpers = {
    takeApp: async (serverApp, user, appName) => {
      await request(serverApp)
              .post('/take')
              .send({user, app: appName})
              .set('Authorization', validAuth)
    }
  }

  beforeEach(async () => {
    await Context.reset()
    await Context.appsRepo.add('appA', 'appB')
  })

  afterAll(async () => {
    await Context.reset()
    Context.exit()
  })

  describe('Authorization', () => {
    it('responds with a 401 if auth not provided', async () => {
      await request(server())
              .get('/')
              .expect(401)
    })

    it('responds with a 401 if auth is invalid', async () => {
      await request(server())
              .get('/')
              .set('Authorization', 'basic: wrong')
              .expect(401)
    })
  })

  describe('Allows', () => {
    // const helpers = {
    //   takeapp: async (server, app, user) => {
    //     await request(server)
    //           .post('/take')
    //           .send({user, app })
    //           .set('Authorization', validAuth)
    //           .set('Content-Type', 'application/json')
    //   }
    // }

    it('a user to take an available app', async () => {
      await request(server())
              .post('/take')
              .send({user: 'john', app: 'appA'})
              .set('Authorization', validAuth)
              .set('Content-Type', 'application/json')
              .expect(200, { text: 'You have taken appA' })
    })

    it('a user to return an app he has taken', async () => {
      await Context.takeApp('appA', 'john')

      await request(server())
              .post('/return')
              .send({user: 'john', app: 'appA'})
              .set('Authorization', validAuth)
              .set('Content-Type', 'application/json')
              .expect(200, { text: 'You have returned appA' })
    })

    // TODO: This!
    it.only('a user to get a status of all apps', async () => {
      await Context.takeApp('appA', 'jack')

      await request(server())
              .get('/status')
              .set('Authorization', validAuth)
              .set('Content-Type', 'application/json')
              .expect(200, { appA: 'taken by jack', appB: 'is free' })
    })
  })

  describe('Refuses', () => {
    it('to take a taken app', async () => {
      await Context.takeApp('appA', 'somedude')

      await request()
              .post('/take')
              .send({user: 'john', app: 'appA'})
              .set('Authorization', validAuth)
              .set('Content-Type', 'application/json')
              .expect(403)
              .expect({ text: 'App is already taken' })
    })

    it('to return an app that was not taken', async () => {
      await request(server())
              .post('/return')
              .send({user: 'john', app: 'appA'})
              .set('Authorization', validAuth)
              .set('Content-Type', 'application/json')
              .expect(403, { text: 'App is not taken' })
    })

    it('to return an app that was not taken by the user', async () => {
      await Context.takeApp('appA', 'billy')

      await request(server())
              .post('/return')
              .send({user: 'john', app: 'appA'})
              .set('Authorization', validAuth)
              .set('Content-Type', 'application/json')
              .expect(403, { text: 'Taken by billy, not you' })
    })
  })
})
