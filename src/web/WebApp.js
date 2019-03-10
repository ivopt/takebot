import express from 'express'
import bodyParser from 'body-parser'

// const channelResponse = (text) => ({ response_type: "in_channel", text })
const userResponse = (text) => ({ response_type: "ephemeral", text })

export default (Context) => {
  const server = express()
  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(bodyParser.json())

  server.get('/', (_req, res) => {
    res.status(200)
       .send("OK")
  })

  server.post('/take', (req, res) => {
    const app = req.body.text
    const user = req.body.user_name

    Context.takeApp(app, user)
           .then(() => res.json(userResponse(`You have taken ${app}`)))
           .catch((error) => res.json(userResponse(error.message)))
  })

  server.post('/return', (req, res) => {
    const app = req.body.text
    const user = req.body.user_name

    Context.returnApp(app, user)
           .then(() => res.json(userResponse(`You have returned ${app}`)))
           .catch((error) => res.json(userResponse(error.message)))
  })

  return {
    run: () =>
      server.listen(3000, () => console.log('Listening on port 3000'))
  }
}
