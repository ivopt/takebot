import express from 'express'
import bodyParser from 'body-parser'
import WebApp from './WebApp'

export default (Context) => {
  const server = express()
  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(bodyParser.json())

  server.use(WebApp(Context))

  return {
    run: () =>
      server.listen(3000, () => console.log('Listening on port 3000'))
  }
}
