const CheckIfAppIsFree = (
  appsRepo
) => async (ctx) => {
  const holder = await appsRepo.holder(ctx.app)

  if (!holder)
    return ctx
  else
    throw "App is already taken"
}

export default CheckIfAppIsFree
