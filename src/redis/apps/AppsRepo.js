class AppsRepo {
  constructor(redisClient, apps = []) {
    this.redisClient = redisClient
    this.appsKey = "TakeBot:taken"
    this.apps = apps
  }

  setApps = (apps) => this.apps = apps
  list = () => Promise.resolve(this.apps)
  take = (app, user) => this.redisClient.hset(this.appsKey, app, user)
  release = (app) => this.redisClient.hdel(this.appsKey, app)
  holder = (app) => this.redisClient.hget(this.appsKey, app)
  status = () => this.redisClient.hgetall(this.appsKey)
}

export default AppsRepo
