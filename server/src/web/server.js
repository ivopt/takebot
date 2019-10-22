import express from 'express'
import bodyParser from 'body-parser'
import WebApp from './WebApp'
import basicAuth from 'express-basic-auth'

const port = process.env.PORT || 3000
const username = process.env.HTTP_AUTH_USERNAME
const password = process.env.HTTP_AUTH_PASSWORD

export default (Context, config) => {
  const server = express()
  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(bodyParser.json())

  if (username && password)
    server.use(basicAuth({ users: { [username]: password }, challenge: true }))
  server.use(express.static('public'))

  server.use(WebApp(Context, config))

  return {
    run: () =>
      server.listen(port, () => console.log(`Listening on port ${port}`))
  }
}
