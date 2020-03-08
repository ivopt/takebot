import { effect } from '../../../util/Railway';
import { AppAlreadyExists } from '../Errors';

const AddApp = (
  appsService,
) => ({app}) =>
  Promise.resolve({app})
         .then(failIfAppAlreadyExists(appsService))
         .then(effect(({app}) => appsService.add(app)))

export default AddApp

// -----------------------------------------------------------------------------
// Private

const failIfAppAlreadyExists = (appsService) => async (ctx) => {
  if (await appsService.exist(ctx.app.name))
    throw new AppAlreadyExists('App already exists')
  return ctx
}
