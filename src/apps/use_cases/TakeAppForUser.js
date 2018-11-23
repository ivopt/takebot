const TakeAppForUser = (
  appsRepo
) => async (ctx) => {
  await appsRepo.take(ctx.app, ctx.user)
  return ctx
}

export default TakeAppForUser
