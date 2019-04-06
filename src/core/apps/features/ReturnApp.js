import CheckIfAppExists from '../UseCases/CheckIfAppExists'
import CheckIfAppIsTaken from '../UseCases/CheckIfAppIsTaken'
import NotifyTeam from '../UseCases/NotifyTeam'
import { effect } from '../../../util/Railway'

const ReturnApp = (
  appsRepo,
  remindersRepo,
  notifier,
  messages
) => (app, user) =>
  Promise.resolve({app, user})
         .then(CheckIfAppExists(appsRepo))
         .then(CheckIfAppIsTaken(appsRepo))
         .then(effect(({app}) => appsRepo.release(app)))
         .then(effect(({app}) => remindersRepo.remove(app)))
         .then(NotifyTeam(notifier, messages.userHasReturnedApp))

export default ReturnApp
