import './env.config'
import Context from './Context'
import server from './web/server'

const apps = process.env["APPS"].split(",")
Context.appsRepo.add(...apps)
const config = {
  env: process.env
}

const run = () => server(Context, config).run()

module.exports = { run }
