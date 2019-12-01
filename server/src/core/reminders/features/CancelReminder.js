import { effect } from '../../../util/Railway'

export default (remindersService) =>
  effect(({app}) => remindersService.remove({app}))
