const RemoveReminders = (
  remindersRepo
) => async (ctx) => {
  await remindersRepo.remove(ctx.app)
  return ctx
}

export default RemoveReminders
