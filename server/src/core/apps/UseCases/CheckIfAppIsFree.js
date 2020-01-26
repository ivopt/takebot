import { effect } from '../../../util/Railway'
import { AppIsTaken } from '../Errors'

export default (appsRepo) => effect(async (ctx) => {
  if (await appsRepo.holder(ctx.app))
    throw new AppIsTaken('App is already taken')
})
