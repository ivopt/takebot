const ListAllApps = (
  appsRepo
) => async (ctx) => {
  await appsRepo.list()

  const appList = (await appsRepo.list())
                  .reduce((acc, app) => acc.concat({id: app}), [])

  return { ...ctx, apps: appList }
}

export default ListAllApps
