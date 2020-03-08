import CheckIfAppExists from '../UseCases/CheckIfAppExists'
import CheckIfAppIsFree from '../UseCases/CheckIfAppIsFree'
import { effect,check } from '../../../util/Railway'

const TakeApp = (
  appsService
) => (context) =>
  Promise.resolve(context)
         .then(check(['user', 'app']))
         .then(CheckIfAppExists(appsService))
         .then(CheckIfAppIsFree(appsService))
         .then(effect(({app, user}) => appsService.take(app, user)))

export default TakeApp
