import { effect } from '../../../util/Railway'

export default (
  remindersService,
  messages
) => effect(async ({app, user}) => {
  const message = messages.areYouDoneWith(app)
  await remindersService.add({app, user, message})
})
