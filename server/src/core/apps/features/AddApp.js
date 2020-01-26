import { Railway, effect, contextMustContain } from '../../../util/Railway';
import { AppAlreadyExists } from '../Errors';

const AddApp = (appsRepo) => Railway([
  contextMustContain(['app']),
  effect(failIfAppAlreadyExists(appsRepo)),
  effect(({app}) => appsRepo.add(app))
])

export default AddApp

// -----------------------------------------------------------------------------
// Private

const failIfAppAlreadyExists = (appsRepo) => async ({app}) => {
  if (await appsRepo.exist(app.name))
    throw new AppAlreadyExists('App already exists')
}
