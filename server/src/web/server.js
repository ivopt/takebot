import express from 'express'
import bodyParser from 'body-parser'

import WebApp from './WebApp'
import ReactApp from './ReactApp'

export default (Context, config) => {
  const port = config.env.PORT || 3000

  const server = express()
  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(bodyParser.json())

  server.use(WebApp(Context, config))
  server.use(ReactApp(Context, config))

  return {
    run: () =>
      server.listen(port, () => console.log(`Listening on port ${port}`))
  }
}
