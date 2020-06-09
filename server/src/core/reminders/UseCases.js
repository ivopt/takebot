import { effect } from '../../util/Railway'

export const SetReminder =
  (remindersService, messages) =>
    effect(async ({app, user, lease}) =>
      await remindersService.add({app, user, lease, message: messages.areYouDoneWith(app)}))

export const CancelReminder =
  (remindersService) =>
    effect(({app}) =>
      remindersService.remove({app}))
