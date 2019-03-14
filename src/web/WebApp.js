import express from 'express'
import bodyParser from 'body-parser'
import SlackRoutes from './Slack'
import RestRoutes from './Rest'

export default (Context) => {
  const server = express()
  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(bodyParser.json())

  server.get('/', (_req, res) => {
    res.status(200)
       .send("OK")
  })

  SlackRoutes(Context, server)
  RestRoutes(Context, server)

  return {
    run: () =>
      server.listen(3000, () => console.log('Listening on port 3000'))
  }
}
