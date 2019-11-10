import { effect } from '../../../util/Railway'

export default (remindersRepo) =>
  effect(({app}) => remindersRepo.remove(app))
