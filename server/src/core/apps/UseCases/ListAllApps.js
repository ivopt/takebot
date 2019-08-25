const ListAllApps = (
  appsRepo
) => async (ctx) => {
  const appList = await appsRepo.list()

  return { ...ctx, apps: appList }
}

export default ListAllApps
