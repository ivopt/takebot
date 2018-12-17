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

    onReset: (callback) => {
      self.__onReset.push(callback)
      return self
    },

    exit: () => {
      self.__onExit.forEach(callback => callback())
    },

    reset: () => {
      self.__onReset.forEach(callback => callback())
    }
  }

  self.__onExit = []
  self.__onReset = []
  return self
}

export default Locator()
export { Locator }
