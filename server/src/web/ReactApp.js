import path from 'path'
import express, { Router } from 'express'
import basicAuth from 'express-basic-auth'

export default (_Context, config, router = new Router()) => {
  const publicFolder = config.env.PUBLIC_FOLDER || 'public'
  const username = config.env.HTTP_AUTH_USERNAME
  const password = config.env.HTTP_AUTH_PASSWORD

  if (username && password)
    router.use(basicAuth({ users: { [username]: password }, challenge: true }))

  router.use(express.static(publicFolder))
  router.get('*', (_req, res) => {
    res.sendFile(path.join(`${publicFolder}/index.html`), { root: './' })
  })

  return router
}
