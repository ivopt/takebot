import CheckIfAppExists from '../UseCases/CheckIfAppExists'
import CheckIfAppIsTaken from '../UseCases/CheckIfAppIsTaken'
import { effect } from '../../../util/Railway'

const ReturnApp = (
  appsRepo,
) => ({app, user}) =>
  Promise.resolve({app, user})
         .then(CheckIfAppExists(appsRepo))
         .then(CheckIfAppIsTaken(appsRepo))
         .then(effect(({app}) => appsRepo.release(app)))

export default ReturnApp
