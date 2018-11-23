// const REMINDER_TIMEOUT = 1000

const SetReminder = (
  appsRepo,
  slackBot,
  delay
) => async (ctx) => {
  // 1. Set timeout on reminder
  // const reminderId = delay(
  //   () => slackBot.warnUser(ctx.user),
  //   REMINDER_TIMEOUT
  // )
  // 2. Assign timeoutid  appsRepo.remind(ctx.app, ctx.timerId)
  // await appsRepo.remind(ctx.app, reminderId)

  // 3. Return ctx with reminder Id;
  return { ...ctx, reminderId }
}

export default SetReminder
