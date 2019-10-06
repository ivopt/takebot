import { Router } from 'express'
import cors from 'cors'

export default (Context, config, router = new Router()) => {
  const validBasicAuth = (authHeader) => {
    if (!authHeader) return false

    const [,auth] = authHeader.match(/.*: (.*)/)
    return auth == config.env['REST_VERIFICATION_TOKEN']
  }

  router.use(cors())

  router.use((req, res, next) => {
    if (!validBasicAuth(req.headers["authorization"]))
      res.status(401).json(userResponse("Invalid credentials"))
    else
      next()
  })

  router.post('/take', (req, res) => {
    const { app, user } = req.body

    Context.takeApp(app, user)
           .then(() => res.json(userResponse(`You have taken ${app}`)))
           .catch((error) => res.status(403).json(userResponse(error.message)))
  })

  router.post('/return', (req, res) => {
    const { app, user } = req.body

    Context.returnApp(app, user)
           .then(() => res.json(userResponse(`You have returned ${app}`)))
           .catch((error) => res.status(403).json(userResponse(error.message)))
  })

  router.put('/add', (req, res) => {
    const app = req.body

    Context.addApp(app)
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
