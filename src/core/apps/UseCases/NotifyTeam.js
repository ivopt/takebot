const NotifyTeam = (
  notifier,
  messageTemplate
) => async (ctx) => {
  notifier.notifyTeam(messageTemplate({user: ctx.user, app: ctx.app}))
  return ctx
}

export default NotifyTeam
