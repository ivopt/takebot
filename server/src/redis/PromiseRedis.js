import { promisify } from 'util'
import { createClient } from 'redis'

export default {
  createClient: ({url}) => {
    const client = createClient({url})
    return {
      keys:      promisify(client.keys).bind(client),
      get:       promisify(client.get).bind(client),
      set:       promisify(client.set).bind(client),
      del:       promisify(client.del).bind(client),
      sadd:      promisify(client.sadd).bind(client),
      srem:      promisify(client.srem).bind(client),
      smembers:  promisify(client.smembers).bind(client),
      sismember: promisify(client.sismember).bind(client),
      hget:      promisify(client.hget).bind(client),
      hset:      promisify(client.hset).bind(client),
      hdel:      promisify(client.hdel).bind(client),
      hkeys:     promisify(client.hkeys).bind(client),
      hvals:     promisify(client.hvals).bind(client),
      hgetall:   promisify(client.hgetall).bind(client),
      flushall:  promisify(client.flushall).bind(client),
      quit:      client.quit.bind(client)
    }
  }
}
