import CheckIfAppExists from '../use_cases/CheckIfAppExists'
import CheckIfAppIsFree from '../use_cases/CheckIfAppIsFree'
import TakeAppForUser   from '../use_cases/TakeAppForUser'
import SetReminder      from '../use_cases/SetReminder'
import WarnInChannel    from '../use_cases/WarnInChannel'

const TakeApp = (app, user) =>
  Promise.resolve({app, user})
         .then(CheckIfAppExists)
         .then(CheckIfAppIsFree)
         .then(TakeAppForUser)
         .then(SetReminder)
         .then(WarnInChannel)

export default TakeApp
