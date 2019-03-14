import Command from './Command/Command'

export default (Context, server) => {
  server.post('/slack', (req, res) => {
    const command = new Command(req.body.user_name, req.body.text)

    command.run(Context)
      .then(({app}) => res.json(userResponse(`You have taken ${app}`)))
      .catch((error) => res.json(userResponse(error.message)))
  })
}

// HELPERS
const userResponse = (text) => ({ response_type: "ephemeral", text })
