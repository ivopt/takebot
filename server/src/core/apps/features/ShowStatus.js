import AllAppsStatus from '../UseCases/AllAppsStatus'

const ShowStatus = (
  appsService,
  messages,
) => () =>
  Promise.resolve({})
         .then(AllAppsStatus(appsService, messages))

export default ShowStatus
