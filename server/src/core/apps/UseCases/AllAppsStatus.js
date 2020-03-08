const message = (messages, user) =>
  user ? messages.appTakenBy(user) : messages.appIsFree()

export default (
  appsService,
  messages
) => async (ctx = {}) => {
  const status =
    (await appsService.status())
      .map((appStatus) => Object.assign({message: message(messages, appStatus.user)}, appStatus))

  return { status, ...ctx }
}
