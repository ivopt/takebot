export default (
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

  // TODO: This does not work properly. On node, the reminderId won't be a number
  //       like it would on a browser, but a rather complex object. This object
  //       cannot be serialized to a redis store and be brought back... a better
  //       thing needs to be done...
  //       Possibly just keeping remindersRepo as a in-memory thing with the ability
  //       to store something that would be used to reinstate the timeout in case
  //       the app crashes or gets restarted
  await remindersRepo.add(ctx.app, reminderId)

  return { ...ctx, reminderId, remindPromise }
}
