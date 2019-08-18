export default (
  appsRepo,
  messages
) => async (ctx = {}) => {
  const appList = await appsRepo.list()
  const takenApps = await appsRepo.takenApps()
  const message = (st) =>
    st ? messages.appTakenBy(st) : messages.appIsFree()
  const appStatus = (st) => st ? 'taken' : 'free'

  const status = appList.reduce((acc, app) =>
    acc.concat({
      id: app,
      status: appStatus(takenApps[app]),
      user: takenApps[app],
      message: message(takenApps[app])
    }), [])

  return { status, ...ctx }
}
