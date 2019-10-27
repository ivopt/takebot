import { Router } from 'express'
import SlackRoutes from './Slack'
import RestRoutes from './Rest'

export default (Context, config, router = new Router()) => {
  router.get('/status', (_req, res) => {
    res.status(200)
       .send("OK")
  })

  router.use('/slack', SlackRoutes(Context, config))
  router.use('/api', RestRoutes(Context, config))

  return router
}
