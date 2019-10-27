import request from 'supertest'
import express from 'express'
import WebApp from '../../src/web/WebApp'

describe('WebApp', () => {
  const app = express().use(WebApp())

  it('responds with a 200 OK when running', (done) => {
    request(app)
      .get('/status')
      .expect(200)
    .end(done)
  })
})
