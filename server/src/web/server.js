import express from 'express'
import bodyParser from 'body-parser'
import WebApp from './WebApp'
import basicAuth from 'express-basic-auth'

export default (Context, config) => {
  const port = config.env.PORT || 3000
  const username = config.env.HTTP_AUTH_USERNAME
  const password = config.env.HTTP_AUTH_PASSWORD
  const publicFolder = config.env.PUBLIC_FOLDER || 'public'

  const server = express()
  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(bodyParser.json())

  if (username && password)
    server.use(basicAuth({ users: { [username]: password }, challenge: true }))
  server.use(express.static(publicFolder))

  server.use(WebApp(Context, config))

  return {
    run: () =>
      server.listen(port, () => console.log(`Listening on port ${port}`))
  }
}
