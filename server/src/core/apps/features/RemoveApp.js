import { effect } from '../../../util/Railway';
import CheckIfAppExists from '../UseCases/CheckIfAppExists';

const RemoveApp = (
  appsRepo,
) => ({app}) =>
  Promise.resolve({app})
         .then(CheckIfAppExists(appsRepo))
         .then(effect(({app}) => appsRepo.remove(app)))

export default RemoveApp
