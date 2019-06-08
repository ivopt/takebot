import AllAppsStatus from '../UseCases/AllAppsStatus'

const ShowStatus = (
  appsRepo,
  messages,
) => () =>
  Promise.resolve({})
         .then(AllAppsStatus(appsRepo, messages))

export default ShowStatus
