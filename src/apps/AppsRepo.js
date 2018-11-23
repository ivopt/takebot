class AppsRepo {
  constructor(redisClient, apps = []) {
    this.redisClient = redisClient
    this.appsKey = "TakeBot:taken"
    this.apps = apps
  }

  list() { return Promise.resolve(this.apps) }

  take(app, user) {
    return this.redisClient.hset(this.appsKey, app, user)
  }

  release(app) {
    return this.redisClient.hdel(this.appsKey, app)
  }

  holder(app) {
    return this.redisClient.hget(this.appsKey, app)
  }

  status() {
    return this.redisClient.hgetall(this.appsKey)
  }
}

export default AppsRepo
