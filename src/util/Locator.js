export const Locator = () => {
  const valid = (name) => {
    if (!name) throw new Error('You must provide a valid name for this service.')
    if (self[name]) throw new Error(`Service '${name}' already registered`)

    return true
  }

  const contextProp = (obj, prop) => Object.assign(obj, {[prop]: self[prop]})
  const getArgs = (injected, grounded) => injected.reduce(contextProp, grounded)
  const fnFactory    = (fn, ...args) => () =>     fn(getArgs(...args))
  const classFactory = (fn, ...args) => () => new fn(getArgs(...args))

  const tap = (fn) => (...args) => { fn(...args); return self }

  const register = (name, factory) => {
    if (valid(name))
      Object.defineProperty(self, name, { configurable: false, get: factory })
  }

  const self = {
    fnFactory: tap((name, fn, injectedArgs = [], groundedArgs = {}) =>
      register(name, fnFactory(fn, injectedArgs, groundedArgs))
    ),

    classFactory: tap((name, fn, injectedArgs = [], groundedArgs = {}) =>
      register(name, classFactory(fn, injectedArgs, groundedArgs))
    ),

    singleton: tap((name, service) => register(name, () => service)),
    onExit: tap((callback) => self.__onExit.push(callback)),
    onReset: tap((callback) => self.__onReset.push(callback)),
    exit: () => { self.__onExit.forEach(callback => callback()) },
    reset: () => { self.__onReset.forEach(callback => callback()) }
  }

  self.__onExit = []
  self.__onReset = []
  return self
}

export default Locator()
