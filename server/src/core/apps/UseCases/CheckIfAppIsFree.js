import { AppIsTaken } from '../Errors'

export default (
  appsService
) => async (ctx) => {
  const holder = await appsService.holder(ctx.app)

  if (!holder)
    return ctx
  else
    throw new AppIsTaken('App is already taken')
}
