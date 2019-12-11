import ListApps from './apps/features/ListApps'
import AddApp from './apps/features/AddApp'
import ShowStatus from './apps/features/ShowStatus'
import TakeApp from './apps/features/TakeApp'
import ReturnApp from './apps/features/ReturnApp'
import SetReminder from './reminders/features/SetReminder'
import CancelReminder from './reminders/features/CancelReminder'
import NotifyTeam from './notifications/features/NotifyTeam'

const takeApp = (
  appsRepo,
  remindersService,
  notifier,
  messages
) => ({app, user}) =>
  Promise.resolve({app, user})
         .then(TakeApp(appsRepo))
         .then(SetReminder(remindersService, messages))
         .then(NotifyTeam(notifier, messages.userHasTakenApp))

const returnApp = (
  appsRepo,
  remindersService,
  notifier,
  messages
) => ({app, user}) =>
  Promise.resolve({app, user})
         .then(ReturnApp(appsRepo))
         .then(CancelReminder(remindersService))
         .then(NotifyTeam(notifier, messages.userHasReturnedApp))

const removeApp = (
  // TODO: This!!
) => ({app}) =>
  Promise.resolve({app})

export default {
  ListApps,
  AddApp,
  ShowStatus,
  RemoveApp: removeApp,
  TakeApp: takeApp,
  ReturnApp: returnApp
}
