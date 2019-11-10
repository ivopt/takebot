import CheckIfAppExists from '../UseCases/CheckIfAppExists'
import CheckIfAppIsFree from '../UseCases/CheckIfAppIsFree'
import { effect,check } from '../../../util/Railway'

const TakeApp = (
  appsRepo
) => (context) =>
  Promise.resolve(context)
         .then(check(['user', 'app']))
         .then(CheckIfAppExists(appsRepo))
         .then(CheckIfAppIsFree(appsRepo))
         .then(effect(({app, user}) => appsRepo.take(app, user)))

export default TakeApp
