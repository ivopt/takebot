import { promisify } from 'util'
import { createClient } from 'redis'

export default {
  createClient: ({url}) => {
    const client = createClient({url})
    return {
      keys:     promisify(client.keys).bind(client),
      get:      promisify(client.get).bind(client),
      set:      promisify(client.set).bind(client),
      del:      promisify(client.del).bind(client),
      hget:     promisify(client.hget).bind(client),
      hset:     promisify(client.hset).bind(client),
      hdel:     promisify(client.hdel).bind(client),
      hgetall:  promisify(client.hgetall).bind(client),
      quit:     client.quit.bind(client)
    }
  }
}
