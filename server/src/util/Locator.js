import fnArgs from 'fn-args'

export const Locator = () => {
  const valid = (name) => {
    if (!name) throw new Error('You must provide a valid name for this service.')
    if (self[name]) throw new Error(`Service '${name}' already registered`)

    return true
  }

  const memoize = (fn) => {
    let memo
    return () => memo || (memo = fn())
  }

  const instantiantize = (name) => name.replace(/^./, (char) => char.toLowerCase())
  const chain = (fn) => (...args) => { fn(...args); return self }

  const getArgs = (args, grounded) => args.map(arg => grounded[arg] || self[arg])

  const fnFactory = (fn, groundedArgs) => () =>
    fn(...getArgs(fnArgs(fn), groundedArgs))

  const classFactory = (constructor, groundedArgs) => () =>
    new constructor(...getArgs(fnArgs(constructor), groundedArgs))

  const register = (name, factory) => {
    if (valid(name))
      Object.defineProperty(self, name, { configurable: false, get: factory })
  }

  const fnName = (name, fn) => name || instantiantize(fn.name)
  const serviceName = (name, service) => name || instantiantize(service.constructor.name)

  const self = {
    fnSingleton: chain((service, {name} = {}) =>
      register(serviceName(name, service), memoize(service))),

    singleton: chain((service, {name} = {}) =>
      register(serviceName(name, service), () => service)),

    fnFactory: chain((fn, {args = {}, name} = {}) =>
      register(fnName(name, fn), fnFactory(fn, args))),

    factory: chain((constructor, { args = {}, name } = {}) =>
      register(fnName(name, constructor), classFactory(constructor, args))),

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
