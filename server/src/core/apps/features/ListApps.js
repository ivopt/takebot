import ListAllApps from '../UseCases/ListAllApps'

const ListApps = (
  appsService,
) => () =>
  Promise.resolve({})
         .then(ListAllApps(appsService))

export default ListApps
