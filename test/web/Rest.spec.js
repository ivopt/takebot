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
  const app = () => TestExpressApp().use(Rest(Context, config))

  beforeEach(() => {
    Context.reset()
    Context.appsRepo.setApps(['appA', 'appB'])
  })
  afterAll(() => { Context.exit() })
  afterEach(() => { Context.reset() })

  describe('Authorization', () => {
    it('responds with a 401 if auth not provided', async () => {
      await request(app())
              .get('/')
              .expect(401)
    })

    it('responds with a 401 if auth is invalid', async () => {
      await request(app())
              .get('/')
              .set('Authorization', 'basic: wrong')
              .expect(401)
    })
  })

  it('allows a user to take an available app', async () => {
    await request(app())
            .post('/take')
            .send({user: 'john', app: 'appA'})
            .set('Authorization', 'basic: banana')
            .set('Content-Type', 'application/json')
            .expect(200, { text: 'You have taken appA' })
  })

  it('allows user to return an app he has taken', async () => {
    await Context.takeApp('appA', 'john')

    await request(app())
      .post('/return')
      .send({user: 'john', app: 'appA'})
      .set('Authorization', 'basic: banana')
      .set('Content-Type', 'application/json')
      .expect(200, { text: 'You have returned appA' })
  })

  it('refuses to take a taken app', async () => {
    await Context.takeApp('appA', 'somedude')

    await request(app())
            .post('/take')
            .send({user: 'john', app: 'appA'})
            .set('Authorization', 'basic: banana')
            .set('Content-Type', 'application/json')
            .expect(403)
            .expect({ text: 'App is already taken' })
  })

  it('refuses to return an app that was not taken', async () => {
    await request(app())
      .post('/return')
      .send({user: 'john', app: 'appA'})
      .set('Authorization', 'basic: banana')
      .set('Content-Type', 'application/json')
      .expect(403, { text: 'App is not taken' })
  })

  it('refuses to return an app that was not taken by the user', async () => {
    await Context.takeApp('appA', 'billy')

    await request(app())
      .post('/return')
      .send({user: 'john', app: 'appA'})
      .set('Authorization', 'basic: banana')
      .set('Content-Type', 'application/json')
      .expect(403, { text: 'Taken by billy, not you' })
  })
})
