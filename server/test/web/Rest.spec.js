import request from 'supertest'
import Rest from '#/src/web/Rest'
import Context from '#/test/support/TestContext'
import TestExpressApp from '#/test/support/TestExpressApp'

const arrayContaining = expect.arrayContaining

describe('Rest', () => {
  const server = () => TestExpressApp().use(Rest(Context))

  beforeEach(async () => {
    await Context.reset()
    await Context.appsRepo.add({name: 'appA'}, {name: 'appB'})
  })

  afterAll(async () => {
    await Context.reset()
    Context.exit()
  })

  describe('Allows', () => {
    it('allows a user to take an available app', async () => {
      await request(server())
              .post('/take')
              .send({user: 'john', app: 'appA'})
              .set('Content-Type', 'application/json')
              .expect(200, { text: 'You have taken appA' })
    })

    it('allows a user to specify a lease time when taking an available app', async () => {
      jest.useFakeTimers()

      await request(server())
              .post('/take')
              .send({user: 'john', app: 'appA', lease: '10m'})
              .set('Content-Type', 'application/json')
              .expect(200, { text: 'You have taken appA' })

      jest.advanceTimersByTime(600000 - 20);
      expect(Context.notifier.userNotifications).toBeEmpty()

      jest.advanceTimersByTime(20);
      expect(Context.notifier.userNotifications).toContainEqual(
        expect.objectContaining({ user: 'john' })
      )
    })

    it('allows a user to return an app he has taken', async () => {
      await Context.takeApp({app: 'appA', user: 'john'})

      await request(server())
              .post('/return')
              .send({user: 'john', app: 'appA'})
              .set('Content-Type', 'application/json')
              .expect(200, { text: 'You have returned appA' })
    })

    it('allows a user to get a status of all apps', async () => {
      await Context.takeApp({app: 'appA', user: 'jack'})

      await request(server())
              .get('/status')
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
              .set('Accept', 'application/json')
              .expect(200)
              .then((response) => JSON.parse(response.text))
              .then(jsonResponse => {
                expect(jsonResponse).toEqual(arrayContaining([
                  { id: 'appA', name: 'appA' },
                  { id: 'appB', name: 'appB' }
                ]))
              })
    })

    it('allows a user to add a new app', async () => {
      await request(server())
              .put('/add')
              .send({name: 'appZ'})
              .set('Accept', 'application/json')
              .expect(200)

      await request(server())
              .get('/list')
              .set('Accept', 'application/json')
              .expect(200)
              .then((response) => JSON.parse(response.text))
              .then(jsonResponse => {
                expect(jsonResponse).toEqual(arrayContaining([
                  { id: 'appA', name: 'appA' },
                  { id: 'appB', name: 'appB' },
                  { id: 'appZ', name: 'appZ' }
                ]))
              })
    })

    it('allows a user to delete an existing app', async () => {
      await request(server())
              .post('/remove')
              .send({name: 'appA'})
              .set('Accept', 'application/json')
              .expect(200)

      await request(server())
              .get('/list')
              .set('Accept', 'application/json')
              .expect(200)
              .then((response) => JSON.parse(response.text))
              .then(jsonResponse => {
                expect(jsonResponse).toEqual([
                  { id: 'appB', name: 'appB' }
                ])
              })
    })
  })

  describe('Refuses', () => {
    it('refuses to take a taken app', async () => {
      await Context.takeApp({ app: 'appA', user: 'somedude' })

      await request(server())
              .post('/take')
              .send({user: 'john', app: 'appA'})
              .set('Content-Type', 'application/json')
              .expect(403)
              .expect({ text: 'App is already taken' })
    })

    it('refuses to return an app that was not taken', async () => {
      await request(server())
              .post('/return')
              .send({user: 'john', app: 'appA'})
              .set('Content-Type', 'application/json')
              .expect(403, { text: 'App is not taken' })
    })

    it('refuses to return an app that was not taken by the user', async () => {
      await Context.takeApp({ app: 'appA', user: 'billy' })

      await request(server())
              .post('/return')
              .send({user: 'john', app: 'appA'})
              .set('Content-Type', 'application/json')
              .expect(403, { text: 'Taken by billy, not you' })
    })

    it('to add an existing app', async () => {
      await request(server())
              .put('/add')
              .send({name: 'appA'})
              .set('Accept', 'application/json')
              .expect(403)
              .expect({ text: 'App already exists' })
    })

    it('to remove a non-existing app', async () => {
      await request(server())
              .post('/remove')
              .send({name: 'appZ'})
              .set('Accept', 'application/json')
              .expect(403)
              .expect({ text: 'App does not exist' })
    })
  })
})
