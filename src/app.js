import './env.config'
import Context from './Context'
import server from './web/server'

Context.appsRepo.setApps(["appA", "appB"])

const run = () => server(Context).run()

module.exports = { run }
