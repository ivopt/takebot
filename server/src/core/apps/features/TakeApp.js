import CheckIfAppExists from '../UseCases/CheckIfAppExists'
import CheckIfAppIsFree from '../UseCases/CheckIfAppIsFree'
import { effect } from '../../../util/Railway'

const TakeApp = (
  appsRepo
) => (app, user) =>
  Promise.resolve({app, user})
         .then(CheckIfAppExists(appsRepo))
         .then(CheckIfAppIsFree(appsRepo))
         .then(effect(({app, user}) => appsRepo.take(app, user)))
         // .then(SetReminder(remindIn, remindersRepo, notifier))
         // .then(NotifyTeam(notifier, messages.userHasTakenApp))

export default TakeApp
