import { Router } from 'express'
import cors from 'cors'
import { pick } from 'lodash/object'
import basicAuth from 'express-basic-auth'

export default (Context, config = {}, router = new Router()) => {
  const username = config.env.HTTP_AUTH_USERNAME
  const password = config.env.HTTP_AUTH_PASSWORD

  router.use(cors())

  if (username && password)
    router.use(basicAuth({ users: { [username]: password }, challenge: true }))

  router.post('/take', (req, res) => {
    const context = pick(req.body, ['app', 'user'])

    Context.takeApp(context)
           .then(() => res.json(userResponse(`You have taken ${context.app}`)))
           .catch((error) => res.status(403).json(userResponse(error.message)))
  })

  router.post('/return', (req, res) => {
    const context = pick(req.body, ['app', 'user'])

    Context.returnApp(context)
           .then(() => res.json(userResponse(`You have returned ${context.app}`)))
           .catch((error) => res.status(403).json(userResponse(error.message)))
  })

  router.put('/add', (req, res) => {
    const app = req.body

    Context.addApp({app})
           .then(() => res.sendStatus(200))
           .catch((error) => res.status(403).json(userResponse(error.message)))
  })

  router.post('/remove', (req, res) => {
    const app = req.body

    Context.removeApp({app: app.name})
           .then(() => res.sendStatus(200))
           .catch((error) => res.status(403).json(userResponse(error.message)))
  })

  router.get('/status', async (_req, res) => {
    Context.showStatus()
           .then(({ status }) => res.json(status))
  })

  router.get('/list', async (_req, res) => {
    Context.listApps()
           .then(({ apps }) => res.json(apps))
  })

  return router
}

const userResponse = (text) => ({ text })
