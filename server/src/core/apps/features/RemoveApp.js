import { effect, contextMustContain, Railway } from '../../../util/Railway';
import CheckIfAppExists from '../UseCases/CheckIfAppExists';

const RemoveApp = (appsRepo) => Railway([
  contextMustContain(['app']),
  CheckIfAppExists(appsRepo),
  effect(({app}) => appsRepo.remove(app))
])

export default RemoveApp
