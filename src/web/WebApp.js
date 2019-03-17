import { Router } from 'express'
import SlackRoutes from './Slack'
import RestRoutes from './Rest'

export default (Context, router = new Router()) => {
  router.get('/', (_req, res) => {
    res.status(200)
       .send("OK")
  })

  router.use('/slack', SlackRoutes(Context))
  router.use(RestRoutes(Context))

  return router
}
