import express from 'express'
import bodyParser from 'body-parser'
import basicAuth from 'express-basic-auth'

import WebApp from './WebApp'
import ReactApp from './ReactApp'

export default (Context, config) => {
  const port = config.env.PORT || 3000
  const username = config.env.HTTP_AUTH_USERNAME
  const password = config.env.HTTP_AUTH_PASSWORD

  const server = express()
  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(bodyParser.json())

  if (username && password)
    server.use(basicAuth({ users: { [username]: password }, challenge: true }))

  server.use(WebApp(Context, config))
  server.use(ReactApp(Context, config))

  return {
    run: () =>
      server.listen(port, () => console.log(`Listening on port ${port}`))
  }
}
