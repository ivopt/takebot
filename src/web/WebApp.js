import express from 'express'
import bodyParser from 'body-parser'

export default (Context) => {
  const server = express()
  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(bodyParser.json())

  server.get('/', (_req, res) => {
    res.status(200)
       .send("OK")
  })

  server.post('/take', (req, res) => {
    console.log('TAKE: ', req.body.app, req.body.user)
    Context.takeApp(req.body.app, req.body.user)
           .then(() => res.json())
           .catch((error) => {
              res.status(400)
              res.json({message: error.message})
            })
  })

  server.post('/return', (req, res) => {
    console.log('RETURN: ', req.body.app, req.body.user)
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
