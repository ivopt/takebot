export default class ITakenAppsRepo {
  /** Marks an app as taken by a user
   *
   * @param app String - name of the application to take
   * @param user String - name of the user taking the app
   * @return Promise(true)
   * @raise AppIsTaken - if app is already taken
   * **/
  take = (app, user) => Promise.reject('Not Implemented!')

  /** Releases an app taken by a user
   *
   * @param app String - name of the application to release
   * @return Promise(true)
   * **/
  release = (app) => Promise.reject('Not Implemented!')

  /** Returns the name of the user holding the app
   *
   * @param app String - name of the application to release
   * @return Promise(string | undefined)
   * **/
  holder = (app) => Promise.reject('Not Implemented!')

  /** Lists all taken apps and by whom where they taken
   *
   * @return Promise(Array<{app, user}>)
   */
  list = () => Promise.reject('Not Implemented!')
}
