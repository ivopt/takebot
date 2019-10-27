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
  remindersRepo,
  notifier,
  messages,
  remindIn,
) => (app, user) =>
  TakeApp(appsRepo)(app, user)
   .then(SetReminder(remindIn, remindersRepo, notifier))
   .then(NotifyTeam(notifier, messages.userHasTakenApp))

const returnApp = (
  appsRepo,
  remindersRepo,
  notifier,
  messages
) => (app, user) =>
  ReturnApp(appsRepo)(app, user)
   .then(CancelReminder(remindersRepo))
   .then(NotifyTeam(notifier, messages.userHasReturnedApp))

export default {
  ListApps,
  AddApp,
  ShowStatus,
  TakeApp: takeApp,
  ReturnApp: returnApp
}
