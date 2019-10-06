import request from 'supertest'
import Rest from '#/src/web/Rest'
import Context from '#/test/support/TestContext'
import TestExpressApp from '#/test/support/TestExpressApp'

const arrayContaining = expect.arrayContaining

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
    await Context.appsRepo.add({name: 'appA'}, {name: 'appB'})
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
    it('allows a user to take an available app', async () => {
      await request(server())
              .post('/take')
              .send({user: 'john', app: 'appA'})
              .set('Authorization', validAuth)
              .set('Content-Type', 'application/json')
              .expect(200, { text: 'You have taken appA' })
    })

    it('allows a user to return an app he has taken', async () => {
      await Context.takeApp('appA', 'john')

      await request(server())
              .post('/return')
              .send({user: 'john', app: 'appA'})
              .set('Authorization', validAuth)
              .set('Content-Type', 'application/json')
              .expect(200, { text: 'You have returned appA' })
    })

    it('allows a user to get a status of all apps', async () => {
      await Context.takeApp('appA', 'jack')

      await request(server())
              .get('/status')
              .set('Authorization', validAuth)
              .set('Accept', 'application/json')
              .expect(200)
              .then((response) => JSON.parse(response.text))
              .then(jsonResponse => {
                expect(jsonResponse).toEqual(arrayContaining([
                  { id: 'appA', status: 'taken', user: 'jack', message: '⛔ taken by jack'},
                  { id: 'appB', status: 'free', message: '✅ is free' }
                ]))
              })
    })

    it('allows a user to list all apps', async () => {
      await request(server())
              .get('/list')
              .set('Authorization', validAuth)
              .set('Accept', 'application/json')
              .expect(200)
              .then((response) => JSON.parse(response.text))
              .then(jsonResponse => {
                expect(jsonResponse).toEqual(arrayContaining([
                  { id: 'appA' },
                  { id: 'appB' }
                ]))
              })
    })

    it('allows a user to add a new app', async () => {
      await request(server())
              .put('/add')
              .send({name: 'appZ'})
              .set('Authorization', validAuth)
              .set('Accept', 'application/json')
              .expect(200)

      await request(server())
              .get('/list')
              .set('Authorization', validAuth)
              .set('Accept', 'application/json')
              .expect(200)
              .then((response) => JSON.parse(response.text))
              .then(jsonResponse => {
                expect(jsonResponse).toEqual(arrayContaining([
                  { id: 'appA' },
                  { id: 'appB' },
                  { id: 'appZ' }
                ]))
              })
    })
  })

  describe('Refuses', () => {
    it('refuses to take a taken app', async () => {
      await Context.takeApp('appA', 'somedude')

      await request(server())
              .post('/take')
              .send({user: 'john', app: 'appA'})
              .set('Authorization', validAuth)
              .set('Content-Type', 'application/json')
              .expect(403)
              .expect({ text: 'App is already taken' })
    })

    it('refuses to return an app that was not taken', async () => {
      await request(server())
              .post('/return')
              .send({user: 'john', app: 'appA'})
              .set('Authorization', validAuth)
              .set('Content-Type', 'application/json')
              .expect(403, { text: 'App is not taken' })
    })

    it('refuses to return an app that was not taken by the user', async () => {
      await Context.takeApp('appA', 'billy')

      await request(server())
              .post('/return')
              .send({user: 'john', app: 'appA'})
              .set('Authorization', validAuth)
              .set('Content-Type', 'application/json')
              .expect(403, { text: 'Taken by billy, not you' })
    })

    it.only('to add an existing app', async () => {
      await request(server())
              .put('/add')
              .send({name: 'appA'})
              .set('Authorization', validAuth)
              .set('Accept', 'application/json')
              .expect(403)
              .expect({ text: 'App already exists' })
    })
  })
})
