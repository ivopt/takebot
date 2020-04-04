export const NotifyTeam =
  (notifier, messageTemplate) =>
    async (ctx) => {
      const message = messageTemplate({user: ctx.user, app: ctx.app})
      notifier.notifyTeam(message)

      return ctx
    }
