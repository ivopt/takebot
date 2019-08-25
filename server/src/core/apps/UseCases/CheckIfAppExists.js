import { AppDoesNotExist } from '../Errors'

export default (
  appsRepo
) => async (ctx) => {
  const appList = await appsRepo.list()

  if (appList.find(app => app.id == ctx.app))
    return ctx
  else
    throw new AppDoesNotExist("App does not exist")
}
