import CheckIfAppExists from '../UseCases/CheckIfAppExists'
import CheckIfAppIsFree from '../UseCases/CheckIfAppIsFree'
import TakeAppForUser from '../UseCases/TakeAppForUser'
import SetReminder from '../UseCases/SetReminder'
import NotifyTeam from '../UseCases/NotifyTeam'

export default ({
  appsRepo,
  remindersRepo,
  notifier,
  messages,
  remindIn,
}) => (app, user) =>
  Promise.resolve({app, user})
         .then(CheckIfAppExists(appsRepo))
         .then(CheckIfAppIsFree(appsRepo))
         .then(TakeAppForUser(appsRepo))
         .then(SetReminder(remindIn, remindersRepo, notifier))
         .then(NotifyTeam(notifier, messages.userHasTakenApp))
