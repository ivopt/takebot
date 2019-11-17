export default (
  remindIn,
  remindersRepo,
  notifier,
) => async (ctx) => {
  const user = ctx.user
  const message = `Are you done with \`${ctx.app}\` ?`

  const interval =
    setInterval(() => notifier.notifyUser(user, message), remindIn)

  await remindersRepo.add(ctx.app, {user, message, interval})

  return { ...ctx, interval }
}
