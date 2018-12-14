const Locator = () => {
  const self = {
    register: (name, service) => {
      if (!name)
        throw new Error('You must provide a valid name for this service.')

      if (self[name])
        throw new Error(`Service '${name}' already registered`)

      if (!service)
        throw new Error(`You must provide a valid service for '${name}'`)

      Object.defineProperty(self, name, {
        configurable: false,
        get: function() { return service }
      })

      return self
    },

    onExit: (callback) => {
      self.__onExit.push(callback)
      return self
    },

    exit: () => {
      self.__onExit.forEach(element => element())
    }
  }

  self.__onExit = []
  return self
}

export default Locator()
export { Locator }
