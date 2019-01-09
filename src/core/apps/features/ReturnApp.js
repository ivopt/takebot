import CheckIfAppExists from '../UseCases/CheckIfAppExists'
import CheckIfAppIsTaken from '../UseCases/CheckIfAppIsTaken'
import ReturnTakenApp from '../UseCases/ReturnTakenApp'
import RemoveReminders from '../UseCases/RemoveReminders'
import NotifyTeam from '../UseCases/NotifyTeam'

export default ({
  appsRepo,
  remindersRepo,
  notifier,
  messages
}) => (app, user) =>
  Promise.resolve({app, user})
         .then(CheckIfAppExists(appsRepo))
         .then(CheckIfAppIsTaken(appsRepo))
         .then(ReturnTakenApp(appsRepo))
         .then(RemoveReminders(remindersRepo))
         .then(NotifyTeam(notifier, messages.userHasReturnedApp))
