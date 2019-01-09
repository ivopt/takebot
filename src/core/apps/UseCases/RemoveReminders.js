export default (
  remindersRepo
) => async (ctx) => {
  await remindersRepo.remove(ctx.app)
  return ctx
}
