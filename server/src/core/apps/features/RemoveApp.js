import { effect } from '../../../util/Railway';
import CheckIfAppExists from '../UseCases/CheckIfAppExists';

const RemoveApp = (
  appsService,
) => ({app}) =>
  Promise.resolve({app})
         .then(CheckIfAppExists(appsService))
         .then(effect(({app}) => appsService.remove(app)))

export default RemoveApp
