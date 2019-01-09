const ReturnTakenApp = (
  appsRepo
) => async (ctx) => {
  await appsRepo.release(ctx.app)
  return ctx
}

export default ReturnTakenApp
