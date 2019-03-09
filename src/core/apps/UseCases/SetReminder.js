export default (
  remindIn,
  remindersRepo,
  notifier,
) => async (ctx) => {
  const sendNotification = () =>
    notifier.notifyUser(ctx.user, `Are you done with \`${ctx.app}\` ?`)

  const reminderId = setTimeout(sendNotification, remindIn)
  await remindersRepo.add(ctx.app, reminderId)

  return { ...ctx, reminderId }
}
