import IAppsRepo from "../../core/apps/IAppsRepo"

export default class AppsRepo extends IAppsRepo {
  constructor(redisClient, rootKey, apps = []) {
    super()
    this.redisClient = redisClient
    this.appsKey = `${rootKey}:taken`
    this.apps = apps
  }

  setApps = (apps) => this.apps = apps
  list = () => Promise.resolve(this.apps)
  take = (app, user) => this.redisClient.hset(this.appsKey, app, user)
  release = (app) => this.redisClient.hdel(this.appsKey, app)
  holder = (app) => this.redisClient.hget(this.appsKey, app)
  status = () => this.redisClient.hgetall(this.appsKey)
}
