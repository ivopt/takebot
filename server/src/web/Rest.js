import { Router } from 'express'
import cors from 'cors'

export default (Context, _config = {}, router = new Router()) => {
  router.use(cors())

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
