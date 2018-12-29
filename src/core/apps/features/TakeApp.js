import CheckIfAppExists from '../UseCases/CheckIfAppExists'
import CheckIfAppIsFree from '../UseCases/CheckIfAppIsFree'
import TakeAppForUser from '../UseCases/TakeAppForUser'
import SetReminder from '../UseCases/SetReminder'
import WarnInChannel from '../UseCases/WarnInChannel'

const TakeApp = ({
  appsRepo,
  remindersRepo,
  notifier,
  remindIn,
}) => (app, user) =>
  Promise.resolve({app, user})
         .then(CheckIfAppExists(appsRepo))
         .then(CheckIfAppIsFree(appsRepo))
         .then(TakeAppForUser(appsRepo))
         .then(SetReminder(remindIn, remindersRepo, notifier))
         .then(WarnInChannel(notifier))

export default TakeApp
