import AllAppsStatus from '../UseCases/AllAppsStatus'
import { Railway } from '../../../util/Railway'

const ShowStatus = (appsRepo, messages) => Railway([AllAppsStatus(appsRepo, messages)])

export default ShowStatus
