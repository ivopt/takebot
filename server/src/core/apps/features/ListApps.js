import ListAllApps from '../UseCases/ListAllApps'
import { Railway } from '../../../util/Railway'

const ListApps = (appsRepo) => Railway([
  ListAllApps(appsRepo)
])

export default ListApps
