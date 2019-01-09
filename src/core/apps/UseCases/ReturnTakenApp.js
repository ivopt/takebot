export default (
  appsRepo
) => async (ctx) => {
  await appsRepo.release(ctx.app)
  return ctx
}
