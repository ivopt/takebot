import { Router } from 'express'
import SlackRoutes from './Slack'
import RestRoutes from './Rest'

export default (Context, config, router = new Router()) => {
  router.get('/', (_req, res) => {
    res.status(200)
       .send("OK")
  })

  router.use('/slack', SlackRoutes(Context, config))
  router.use(RestRoutes(Context, config))

  return router
}
