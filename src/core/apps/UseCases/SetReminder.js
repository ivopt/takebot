const SetReminder = (
  remindIn,
  remindersRepo,
  notifier,
) => async (ctx) => {
  let reminderId

  const remindPromise = new Promise((resolve, _reject) => {
    const sendNotification = () => resolve(
      notifier.notifyUser(ctx.user, `Are you done with \`${ctx.app}\` ?`)
    )
    reminderId = setTimeout(sendNotification, remindIn)
  })

  await remindersRepo.add(ctx.app, reminderId)

  return { ...ctx, reminderId, remindPromise }
}

export default SetReminder
