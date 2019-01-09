import { AppIsNotTaken, AppIsTakenByOtherUser } from '../Errors'

const CheckIfAppIsTaken = (
  appsRepo
) => async (ctx) => {
  const holder = await appsRepo.holder(ctx.app)

  if (!holder)
    throw new AppIsNotTaken("App is not taken")
  if (holder !== ctx.user)
    throw new AppIsTakenByOtherUser(`Taken by ${holder}, not you`)

  return ctx
}

export default CheckIfAppIsTaken
