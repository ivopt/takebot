import IAppsRepo from "../../core/apps/IAppsRepo"
import { coalesce } from "../helpers"

export default class AppsRepo extends IAppsRepo {
  constructor(redisClient, rootKey) {
    super()
    this.redisClient = redisClient
    this.appsKey = `${rootKey}:apps`
    this.takenAppsKey = `${this.appsKey}:taken`
  }

  add = (...apps) => Promise.all(apps.map(this._addApp))
  remove = (...appIds) => Promise.all(appIds.map(this._removeApp))
  list = () => this.redisClient.hvals(this.appsKey)
                               .then((d) => d.map(JSON.parse))
  exist = (appId) => this.list()
                         .then(findById(appId))

  take = (app, user) => this.redisClient.hset(this.takenAppsKey, app, user)
  release = (app) => this.redisClient.hdel(this.takenAppsKey, app)
  holder = (app) => this.redisClient.hget(this.takenAppsKey, app)
  takenApps = () => this.redisClient.hgetall(this.takenAppsKey)
                                    .then(coalesce({}))

  // Private
  _addApp = (app) =>
    this.redisClient.hset(this.appsKey, app.name, JSON.stringify({id: app.name, ...app}))

  _removeApp = (appId) => this.redisClient.hdel(this.appsKey, appId)
}

const findById = (id) => (list) => list.find(it => id == it.id)
