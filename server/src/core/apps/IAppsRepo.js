export default class IAppsRepo {
  /** Adds new apps to the system
   * Either adds all or none
   *
   * @param apps Array<App> - list of apps to be added
   * @return Promise(true)
   * @raise AppAlreadyExists if any of the app already exists
   * **/
  add = (...apps) => Promise.reject('Not Implemented!')

  /** Removes apps from the system
   *
   * @param apps Array<App> - list of apps to be removed
   * @return Promise(true)
   * **/
  remove = (...apps) => Promise.reject('Not Implemented!')

  /** Lists apps on the system
   *
   * @return Promise(Array<App> || [])
   * **/
  list = () => Promise.reject('Not Implemented!')

  /** Checks if an app exists
   *
   * @return Promise(true || false)
   * **/
  exist = (app) => Promise.reject('Not Implemented!')
}
