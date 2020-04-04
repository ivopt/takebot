import ITakenAppsRepo from "../../core/apps/ITakenAppsRepo"
import { AppIsTaken } from "../../core/apps/Errors"
import { coalesce } from "../helpers"

export default class TakenAppsRepo extends ITakenAppsRepo {
  constructor(redisClient, rootKey) {
    super()
    this.redis = redisClient
    this.key = `${rootKey}:apps:taken`
  }

  take = async (app, user) => {
    const holder = await this.holder(app)
    if (!holder)
      return this.redis.hset(this.key, app, user)
    else
      throw new AppIsTaken('App is already taken')
  }

  release = async (app) => this.redis.hdel(this.key, app)

  holder = (app) => this.redis.hget(this.key, app)

  list = () => this.redis.hgetall(this.key)
                         .then(coalesce({}))
}
