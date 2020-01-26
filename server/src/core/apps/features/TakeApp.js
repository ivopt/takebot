import CheckIfAppExists from '../UseCases/CheckIfAppExists'
import CheckIfAppIsFree from '../UseCases/CheckIfAppIsFree'
import { effect, contextMustContain, Railway } from '../../../util/Railway'

const TakeApp = (appsRepo) => Railway([
  contextMustContain(['user', 'app']),
  CheckIfAppExists(appsRepo),
  CheckIfAppIsFree(appsRepo),
  effect(({app, user}) => appsRepo.take(app, user))
])

export default TakeApp
