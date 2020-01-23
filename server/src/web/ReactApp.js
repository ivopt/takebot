import path from 'path'
import express, { Router } from 'express'
import setupBasicAuth from './HttpBasicAuthHelper'

export default (_Context, config, router = new Router()) => {
  setupBasicAuth(config, router)
  
  const publicFolder = config.env.PUBLIC_FOLDER || 'public'

  router.use(express.static(publicFolder))
  router.get('*', (_req, res) => {
    res.sendFile(path.join(`${publicFolder}/index.html`), { root: './' })
  })

  return router
}
