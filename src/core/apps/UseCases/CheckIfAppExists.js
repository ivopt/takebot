import { AppDoesNotExist } from '../Errors'

const CheckIfAppExists = (
  appsRepo
) => async (ctx) => {
  const appList = await appsRepo.list()

  if (appList.find(app => app == ctx.app))
    return ctx
  else
    throw new AppDoesNotExist("App does not exist")
}

export default CheckIfAppExists
