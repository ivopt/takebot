const SetReminder = (
  remindIn,
  delayFn,
  remindersRepo,
  slackBot,
) => async (ctx) => {
  const remindUser = () => slackBot.remindUserToRelease(ctx.user, ctx.app)
  const reminderId = delayFn(remindUser, remindIn)

  await remindersRepo.add(ctx.app, reminderId)

  return { ...ctx, reminderId }
}

export default SetReminder
