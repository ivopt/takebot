import ITakeNotifier from '../core/ITakeNotifier'

export default class TakeNotifier extends ITakeNotifier {
  notifyUser = (user, message) => console.log(`to '${user}': ${message}`)
  notifyTeam = (message) => console.log(`on channel: ${message}`)

  reset = () => {}
}
