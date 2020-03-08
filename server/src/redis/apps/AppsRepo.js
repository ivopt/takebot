import IAppsRepo from "../../core/apps/IAppsRepo"
import { coalesce } from "../helpers"
import { AppAlreadyExists } from "../../core/apps/Errors"

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
  exist = (appName) => this.list()
                           .then(findByName(appName))

  // Private
  _addApp = (app) =>
    this.redisClient.hset(this.appsKey, app.name, JSON.stringify({id: app.name, ...app}))

  _removeApp = (appId) => this.redisClient.hdel(this.appsKey, appId)
}

const findByName = (name) => (list) => list.find(it => name == it.name)
