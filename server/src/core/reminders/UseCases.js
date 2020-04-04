import { effect } from '../../util/Railway'

export const SetReminder =
  (remindersService, messages) =>
    effect(async ({app, user}) =>
      await remindersService.add({app, user, message: messages.areYouDoneWith(app)}))

export const CancelReminder =
  (remindersService) =>
    effect(({app}) =>
      remindersService.remove({app}))
