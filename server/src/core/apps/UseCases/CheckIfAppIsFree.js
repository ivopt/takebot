import { AppIsTaken } from '../Errors'

export default (
  appsRepo
) => async (ctx) => {
  const holder = await appsRepo.holder(ctx.app)

  if (!holder)
    return ctx
  else
    throw new AppIsTaken('App is already taken')
}
