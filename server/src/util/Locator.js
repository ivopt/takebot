import fnArgs from 'fn-args'

export const Locator = () => {
  const valid = (name) => {
    if (!name) throw new Error('You must provide a valid name for this service.')
    if (self[name]) throw new Error(`Service '${name}' already registered`)

    return true
  }

  const instantiantize = (name) => name.replace(/^./, (char) => char.toLowerCase())
  const chain = (fn) => (...args) => { fn(...args); return self }

  const getArgs = (args, grounded) => args.map(arg => grounded[arg] || self[arg])
  const fnFactory = (fn, groundedArgs) => () => fn(...getArgs(fnArgs(fn), groundedArgs))

  const register = (name, factory) => {
    if (valid(name))
      Object.defineProperty(self, name, { configurable: false, get: factory })
  }

  const fnName = (name, fn) => name || instantiantize(fn.name)
  const serviceName = (name, service) => name || instantiantize(service.constructor.name)

  const self = {
    fnFactory: chain((fn, {args = {}, name} = {}) =>
      register(fnName(name, fn), fnFactory(fn, args))),

    singleton: chain((service, {name} = {}) =>
      register(serviceName(name, service), () => service)),

    lazySingleton: chain(() => {}),
    // classFactory: chain((name, fn, injectedArgs = [], groundedArgs = {}) =>
    //   register(name, classFactory(fn, injectedArgs, groundedArgs))),

    onExit: chain((callback) => self.__onExit.push(callback)),
    onReset: chain((callback) => self.__onReset.push(callback)),
    exit: () => { self.__onExit.forEach(callback => callback()) },
    reset: () => Promise.all(self.__onReset.map(async callback => await callback())),

    buildFn: (fn, args = {}) => fnFactory(fn, args)(),
  }

  self.__onExit = []
  self.__onReset = []
  return self
}

export default Locator()
