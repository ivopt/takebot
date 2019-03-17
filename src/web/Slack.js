import { Router } from 'express'
import Command from './Command/Command'

const validToken = (token) =>
  token == process.env['SLACK_VERIFICATION_TOKEN']

export default (Context, router = new Router()) => {
  router.post('/', (req, res) => {
    if (!validToken(req.body.token)) {
      res.status(401)
      return res.json(userResponse("Invalid credentials"))
    }

    const command = new Command(req.body.user_name, req.body.text)

    command.run(Context)
      .then(({app}) => res.json(userResponse(`You have taken ${app}`)))
      .catch((error) => res.json(userResponse(error.message)))
  })

  return router
}

// HELPERS
const userResponse = (text) => ({ response_type: "ephemeral", text })
