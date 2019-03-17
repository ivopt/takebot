import { Router } from 'express'

const validBasicAuth = (authHeader) => {
  const [,auth] = authHeader.match(/.*: (.*)/)
  return auth == process.env['REST_VERIFICATION_TOKEN']
}

export default (Context, router = new Router()) => {
  router.post('/take', (req, res) => {
    if (!validBasicAuth(req.headers["authorization"])) {
      res.status(401)
      return res.json(userResponse("Invalid credentials"))
    }

    const { app, user } = req.body

    Context.takeApp(app, user)
           .then(() => res.json(userResponse(`You have taken ${app}`)))
           .catch((error) => res.json(userResponse(error.message)))
  })

  router.post('/return', (req, res) => {
    if (!validBasicAuth(req.headers["authorization"])) {
      res.status(401)
      return res.json(userResponse("Invalid credentials"))
    }

    const { app, user } = req.body

    Context.returnApp(app, user)
           .then(() => res.json(userResponse(`You have returned ${app}`)))
           .catch((error) => res.json(userResponse(error.message)))
  })

  return router
}

const userResponse = (text) => ({ response_type: "ephemeral", text })
