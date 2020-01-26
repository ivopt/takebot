import CheckIfAppExists from '../UseCases/CheckIfAppExists'
import CheckIfAppIsTaken from '../UseCases/CheckIfAppIsTaken'
import { contextMustContain, effect, Railway } from '../../../util/Railway'

const ReturnApp = (appsRepo) => Railway([
  contextMustContain('app', 'user'),
  CheckIfAppExists(appsRepo),
  CheckIfAppIsTaken(appsRepo),
  effect(({app}) => appsRepo.release(app))
])

export default ReturnApp
