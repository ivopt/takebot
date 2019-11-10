import { effect } from '../../../util/Railway';
import { AppAlreadyExists } from '../Errors';

const AddApp = (
  appsRepo,
) => ({app}) =>
  Promise.resolve({app})
         .then(failIfAppAlreadyExists(appsRepo))
         .then(effect(({app}) => appsRepo.add(app)))

export default AddApp

// -----------------------------------------------------------------------------
// Private

const failIfAppAlreadyExists = (appsRepo) => async (ctx) => {
  if (await appsRepo.exist(ctx.app.name))
    throw new AppAlreadyExists('App already exists')
  return ctx
}
