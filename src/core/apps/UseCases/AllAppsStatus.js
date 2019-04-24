export default (
  appsRepo,
  messages
) => async (ctx = {}) => {
  const appList = await appsRepo.list()
  const takenApps = await appsRepo.takenApps()
  const selectMessage = (st) =>
    st ? messages.appTakenBy(st) : messages.appIsFree()

  const status = appList.reduce((acc, app) =>
    Object.assign(acc, {[app]: selectMessage(takenApps[app])})
  , {})

  return { status, ...ctx }
}
