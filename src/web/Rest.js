import { Router } from 'express'

export default (Context, config, router = new Router()) => {
  const validBasicAuth = (authHeader) => {
    if (!authHeader) return false

    const [,auth] = authHeader.match(/.*: (.*)/)
    return auth == config.env['REST_VERIFICATION_TOKEN']
  }

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
           .catch((error) => res.json(userResponse(error.message)))
  })

  router.post('/return', (req, res) => {
    const { app, user } = req.body

    Context.returnApp(app, user)
           .then(() => res.json(userResponse(`You have returned ${app}`)))
           .catch((error) => res.json(userResponse(error.message)))
  })

  return router
}

const userResponse = (text) => ({ response_type: "ephemeral", text })
