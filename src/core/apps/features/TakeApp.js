import CheckIfAppExists from '../UseCases/CheckIfAppExists'
import CheckIfAppIsFree from '../UseCases/CheckIfAppIsFree'
import SetReminder from '../UseCases/SetReminder'
import NotifyTeam from '../UseCases/NotifyTeam'
import { effect } from '../../../util/Railway'

const TakeApp = (
  appsRepo,
  remindersRepo,
  notifier,
  messages,
  remindIn,
) => (app, user) =>
  Promise.resolve({app, user})
         .then(CheckIfAppExists(appsRepo))
         .then(CheckIfAppIsFree(appsRepo))
         .then(effect(({app, user}) => appsRepo.take(app, user)))
         .then(SetReminder(remindIn, remindersRepo, notifier))
         .then(NotifyTeam(notifier, messages.userHasTakenApp))

export default TakeApp
