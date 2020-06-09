import CommandLineParser from './CommandLineParser'

export default class Command {
  constructor(user, commandLine) {
    const {name, app, lease} = CommandLineParser.parse(commandLine)
    this.name = name
    this.app = app
    this.lease = lease
    this.user = user
  }

  run = (Context) =>
    (this[`run_${this.name}`] || this.invalidCommand)(Context)

  invalidCommand = (_) => Promise.reject({message: "Invalid command"})

  run_take   = (Context) => Context.takeApp({app: this.app, user: this.user, lease: this.lease})
  run_return = (Context) => Context.returnApp({app: this.app, user: this.user})
  run_status = (Context) => Context.showStatus()

  run_list   = (_Context) => Promise.reject({message: "list is not yet implemented"})
  run_add    = (_Context) => Promise.reject({message: "add is not yet implemented"})
  run_remove = (_Context) => Promise.reject({message: "remove is not yet implemented"})
}
