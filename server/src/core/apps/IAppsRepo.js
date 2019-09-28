export default class IAppsRepo {
  add    = (...apps) => Promise.reject("Not Implemented!")
  remove = (...apps) => Promise.reject("Not Implemented!")
  list   = ()        => Promise.reject("Not Implemented!")
  exist  = (app)     => Promise.reject("Not Implemented!")

  take      = (app, user) => Promise.reject("Not Implemented!")
  release   = (app)       => Promise.reject("Not Implemented!")
  holder    = (app)       => Promise.reject("Not Implemented!")
  takenApps = ()          => Promise.reject("Not Implemented!")
  appStatus = (app)       => Promise.reject("Not Implemented!")
}
