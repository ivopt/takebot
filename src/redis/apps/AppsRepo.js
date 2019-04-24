import IAppsRepo from "../../core/apps/IAppsRepo"
import { coalesce } from "../helpers"

export default class AppsRepo extends IAppsRepo {
  constructor(redisClient, rootKey) {
    super()
    this.redisClient = redisClient
    this.appsKey = `${rootKey}:apps`
    this.takenAppsKey = `${this.appsKey}:taken`
  }

  add    = (...apps) => Promise.all(apps.map(app => this.redisClient.sadd(this.appsKey, app)))
  remove = (...apps) => Promise.all(apps.map(app => this.redisClient.srem(this.appsKey, app)))
  list   = () => this.redisClient.smembers(this.appsKey)

  take = (app, user) => this.redisClient.hset(this.takenAppsKey, app, user)
  release = (app) => this.redisClient.hdel(this.takenAppsKey, app)
  holder = (app) => this.redisClient.hget(this.takenAppsKey, app)
  takenApps = () => this.redisClient.hgetall(this.takenAppsKey)
                                    .then(coalesce({}))
  // TODO: implement appStatus
  // appStatus = (app)       => Promise.reject("Not Implemented!")
}
