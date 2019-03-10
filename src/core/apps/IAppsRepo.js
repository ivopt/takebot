export default class IAppsRepo {
  setApps = (apps)      => { throw "Not Implemented!" }
  list    = ()          => Promise.reject("Not Implemented!")
  take    = (app, user) => Promise.reject("Not Implemented!")
  release = (app)       => Promise.reject("Not Implemented!")
  holder  = (app)       => Promise.reject("Not Implemented!")
  status  = ()          => Promise.reject("Not Implemented!")
}
