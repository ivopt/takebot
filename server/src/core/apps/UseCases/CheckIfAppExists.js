import { AppDoesNotExist } from '../Errors'

export default (
  appsService
) => async (ctx) => {
  if (await appsService.exist(ctx.app))
    return ctx
  else
    throw new AppDoesNotExist('App does not exist')
}
