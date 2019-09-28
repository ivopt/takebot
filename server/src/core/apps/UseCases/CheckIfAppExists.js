import { AppDoesNotExist } from '../Errors'

export default (
  appsRepo
) => async (ctx) => {
  if (await appsRepo.exist(ctx.app))
    return ctx
  else
    throw new AppDoesNotExist("App does not exist")
}
