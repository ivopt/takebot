import request from 'supertest'
import express from 'express'
import Rest from '../../src/web/Rest'

describe('Rest', () => {
  const config = {
    env: {
      'REST_VERIFICATION_TOKEN': 'banana'
    }
  }
  let Context
  let app

  beforeEach(() => {
    Context = {
      takeApp: () => {},
      returnApp: () => {},
    }
    app = express().use(Rest(Context, config))
  })

  describe('Authorization', () => {
    it('responds with a 401 if auth not provided', (done) => {
      request(app)
        .get('/')
        .expect(401)
      .end(done)
    })

    it('responds with a 401 if auth is invalid', (done) => {
      request(app)
        .get('/')
        .set('Authorization', 'basic: wrong')
        .expect(401)
      .end(done)
    })
  })
})
