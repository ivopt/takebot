const ListAllApps = (
  appsService
) => async (ctx) => {
  const appList = await appsService.list()

  return { ...ctx, apps: appList }
}

export default ListAllApps
