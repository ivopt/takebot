import { effect } from '../../../util/Railway'
import { AppDoesNotExist } from '../Errors'

export default (appsRepo) => effect(async (ctx) => {
  if (!await appsRepo.exist(ctx.app))
    throw new AppDoesNotExist('App does not exist')
})
