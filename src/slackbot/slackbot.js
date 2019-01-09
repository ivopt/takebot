import ITakeNotifier from "../core/ITakeNotifier"

export default class SlackBot extends ITakeNotifier {
  constructor() {
    super()
    // TODO: This
  }

  notifyTeam = () => { throw "Should have implemented, but didn't yet!" }
  notifyUser = () => { throw "Should have implemented, but didn't yet!" }
}
