export default (
  appsRepo
) => async (ctx) => {
  await appsRepo.take(ctx.app, ctx.user)
  return ctx
}
