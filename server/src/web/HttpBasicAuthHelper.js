import basicAuth from 'express-basic-auth'

const setupBasicAuth = (config, router) => {
  const username = config.env && config.env.HTTP_AUTH_USERNAME
  const password = config.env && config.env.HTTP_AUTH_PASSWORD
  
  if (username && password)
    router.use(basicAuth({ users: { [username]: password }, challenge: true }))
}

export default setupBasicAuth