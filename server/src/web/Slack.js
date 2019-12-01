import { Router } from 'express'
import Command from './Command/Command'

export default (Context, config, router = new Router()) => {
  const validToken = (token) =>
    token == config.env['SLACK_VERIFICATION_TOKEN']

  router.use((req, res, next) => {
    if (!validToken(req.body.token))
      res.status(401).json(userResponse("Invalid credentials"))
    else
      next()
  })

  router.post('/', (req, res) => {
    const command = new Command(req.body.user_name, req.body.text)

    command.run(Context)
      .then(ctx => {
        const response = respondToSlack(command, ctx)
        if (response)
          res.json(userResponse(response))
        else
          res.status(200).end()
      })
      .catch((error) => res.json(userResponse(error.message)))
  })

  return router
}

// HELPERS
const userResponse = (text) => ({ response_type: "ephemeral", text })

const respondToSlack = (command, ctx) => {
  switch (command.name) {
    case 'take':
      return null // `You have taken ${ctx.app}`

    case 'return':
      return null // `You have returned ${ctx.app}`

    case 'status':
      return ctx.status
                .map(({id, message}) => `• \`${id}\` - ${message}`)
                .join("\n")
  }
}
