import { AppDoesNotExist } from './Errors'

export default class AppsService {
  constructor(appsRepo, takenAppsRepo) {
    this.appsRepo = appsRepo
    this.takenAppsRepo = takenAppsRepo
  }

  // ---------------------------------------------------------------------------
  add    = async (...args) => await this.appsRepo.add(...args)
  remove = async (...args) => await this.appsRepo.remove(...args)
  list   = async (...args) => await this.appsRepo.list(...args)
  exist  = async (...args) => await this.appsRepo.exist(...args)

  // ---------------------------------------------------------------------------
  take = async (app, user) => {
    if (!await this.exist(app)){
      throw new AppDoesNotExist(`${app} does not exist`)
    }

    return this.takenAppsRepo.take(app, user)
  }

  // ---------------------------------------------------------------------------
  release = async (app) => this.takenAppsRepo.release(app)

  // ---------------------------------------------------------------------------
  holder = (app) => this.takenAppsRepo.holder(app)

  // ---------------------------------------------------------------------------
  status = async () => {
    const appList = await this.appsRepo.list()
    const takenApps = await this.takenAppsRepo.list()
    const appStatus = (st) => st ? 'taken' : 'free'

    return appList.map(a => a.id)
                  .reduce((acc, app) =>
                    acc.concat({
                      id:     app,
                      status: appStatus(takenApps[app]),
                      user:   takenApps[app]
                    }), []
                  )
  }
}
