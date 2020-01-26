import { chain } from "../../../util/Railway"

const ListAllApps = (appsRepo) => 
  chain(async () => ({ apps: await appsRepo.list() }))

export default ListAllApps
