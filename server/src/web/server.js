import express from 'express'
import bodyParser from 'body-parser'
import WebApp from './WebApp'

const port = process.env.PORT || 3000

export default (Context, config) => {
  const server = express()
  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(bodyParser.json())

  server.use(WebApp(Context, config))

  return {
    run: () =>
      server.listen(port, () => console.log(`Listening on port ${port}`))
  }
}
