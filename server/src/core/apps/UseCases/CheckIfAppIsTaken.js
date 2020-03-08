import { AppIsNotTaken, AppIsTakenByOtherUser } from '../Errors'

export default (
  appsService
) => async (ctx) => {
  const holder = await appsService.holder(ctx.app)

  if (!holder)
    throw new AppIsNotTaken('App is not taken')
  if (holder !== ctx.user)
    throw new AppIsTakenByOtherUser(`Taken by ${holder}, not you`)

  return ctx
}
