import CheckIfAppExists from '../UseCases/CheckIfAppExists'
import CheckIfAppIsTaken from '../UseCases/CheckIfAppIsTaken'
import { effect } from '../../../util/Railway'

const ReturnApp = (
  appsService,
) => ({app, user}) =>
  Promise.resolve({app, user})
         .then(CheckIfAppExists(appsService))
         .then(CheckIfAppIsTaken(appsService))
         .then(effect(({app}) => appsService.release(app, user)))

export default ReturnApp
