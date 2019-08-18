import ListAllApps from '../UseCases/ListAllApps'

const ListApps = (
  appsRepo,
) => () =>
  Promise.resolve({})
         .then(ListAllApps(appsRepo))

export default ListApps
