import './env.config'
import Context from './Context'
import WebApp from './web/WebApp'

Context.appsRepo.setApps(["appA", "appB"])

const run = () => WebApp(Context).run()

module.exports = { run }
