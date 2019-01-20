import express from 'express'
import bodyParser from 'body-parser'

export default (Context) => {
  const server = express()
  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(bodyParser.json())

  server.post('/take', (req, res) => {
    Context.takeApp(req.body.app, req.body.user)
           .then(() => res.json())
           .catch((error) => {
              res.status(400)
              res.json({message: error})
            })
  })

  server.post('/return', (req, res) => {
    Context.returnApp(req.body.app, req.body.user)
           .then(() => res.json())
           .catch((error) => {
             res.status(400)
             res.json({message: error.message})
           })
  })

  return {
    run: () =>
      server.listen(3000, () => console.log('Listening on port 3000'))
  }
}
