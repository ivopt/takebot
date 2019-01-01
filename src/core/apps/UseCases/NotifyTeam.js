const NotifyTeam = (
  notifier
) => async (ctx) => {
  notifier.notifyTeam(`${ctx.user} has taken \`${ctx.app}\``)
  return ctx
}

export default NotifyTeam
