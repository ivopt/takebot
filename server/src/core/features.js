import { SetReminder, CancelReminder } from './reminders/UseCases'
import { NotifyTeam } from './notifications/UseCases'

import {
  ListApps,
  AddApp,
  RemoveApp,
  ShowStatus,
  TakeApp,
  ReturnApp,
} from './apps/UseCases'

const takeApp = (
  appsService,
  remindersService,
  notifier,
  messages
) => ({app, user, lease}) =>
  Promise.resolve({app, user, lease})
         .then(TakeApp(appsService))
         .then(SetReminder(remindersService, messages))
         .then(NotifyTeam(notifier, messages.userHasTakenApp))

const returnApp = (
  appsService,
  remindersService,
  notifier,
  messages
) => ({app, user}) =>
  Promise.resolve({app, user})
         .then(ReturnApp(appsService))
         .then(CancelReminder(remindersService))
         .then(NotifyTeam(notifier, messages.userHasReturnedApp))

const removeApp = (
  appsService,
  remindersService,
  notifier,
  messages
) => ({app}) =>
  Promise.resolve({app})
         .then(RemoveApp(appsService))
         .then(CancelReminder(remindersService))
         .then(NotifyTeam(notifier, messages.appHasBeenRemoved))

export default {
  ListApps,
  AddApp,
  ShowStatus,
  RemoveApp: removeApp,
  TakeApp: takeApp,
  ReturnApp: returnApp
}
