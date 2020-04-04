import { effect, check } from '../../util/Railway'
import {
  AppAlreadyExists,
  AppDoesNotExist,
  AppIsNotTaken,
  AppIsTakenByOtherUser,
  AppIsTaken
} from './Errors'

// -----------------------------------------------------------------------------
export const AddApp = (appsService) =>
  ({app}) => Promise.resolve({app})
                    .then(failIfAppAlreadyExists(appsService))
                    .then(effect(({app}) => appsService.add(app)))

// -----------------------------------------------------------------------------
export const ListApps = (appsService) =>
  () => Promise.resolve({})
               .then(async (ctx) => {
                 const appList = await appsService.list()
                 return { ...ctx, apps: appList }
               })

// -----------------------------------------------------------------------------
export const RemoveApp = (appsService) =>
  ({app}) => Promise.resolve({app})
                    .then(CheckIfAppExists(appsService))
                    .then(effect(({app}) => appsService.remove(app)))

// -----------------------------------------------------------------------------
export const ReturnApp = (appsService) =>
  ({app, user}) => Promise.resolve({app, user})
                          .then(CheckIfAppExists(appsService))
                          .then(CheckIfAppIsTaken(appsService))
                          .then(effect(({app}) => appsService.release(app, user)))

// -----------------------------------------------------------------------------
export const ShowStatus = (appsService, messages) =>
  () => Promise.resolve({})
               .then(AllAppsStatus(appsService, messages))

// -----------------------------------------------------------------------------
export const TakeApp = (appsService) =>
  (context) => Promise.resolve(context)
                      .then(check(['user', 'app']))
                      .then(CheckIfAppExists(appsService))
                      .then(CheckIfAppIsFree(appsService))
                      .then(effect(({app, user}) => appsService.take(app, user)))

// -----------------------------------------------------------------------------
// Private

const failIfAppAlreadyExists = (appsService) => async (ctx) => {
  if (await appsService.exist(ctx.app.name))
    throw new AppAlreadyExists('App already exists')
  return ctx
}

const CheckIfAppExists = (appsService) => async (ctx) => {
  if (await appsService.exist(ctx.app))
    return ctx
  else
    throw new AppDoesNotExist('App does not exist')
}

const CheckIfAppIsTaken = (appsService) => async (ctx) => {
  const holder = await appsService.holder(ctx.app)

  if (!holder)
    throw new AppIsNotTaken('App is not taken')
  if (holder !== ctx.user)
    throw new AppIsTakenByOtherUser(`Taken by ${holder}, not you`)

  return ctx
}

const message = (messages, user) =>
  user ? messages.appTakenBy(user) : messages.appIsFree()

const AllAppsStatus = (
  appsService,
  messages
) => async (ctx = {}) => {
  const status =
    (await appsService.status())
      .map((appStatus) => Object.assign({message: message(messages, appStatus.user)}, appStatus))

  return { status, ...ctx }
}

const CheckIfAppIsFree = (appsService) => async (ctx) => {
  const holder = await appsService.holder(ctx.app)

  if (!holder)
    return ctx
  else
    throw new AppIsTaken('App is already taken')
}
