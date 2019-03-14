import CommandLineParser from './CommandLineParser'

export default class Command {
  constructor(user, commandLine) {
    const {name, app, options} = CommandLineParser.parse(commandLine)
    this.name = name
    this.app = app
    this.options = options
    this.user = user
  }

  run = (Context) =>
    (this[`run_${this.name}`] || this.invalidCommand)(Context)

  invalidCommand = (_) => Promise.reject({message: "Invalid command"})

  run_take   = (Context) => Context.takeApp(this.app, this.user)
  run_return = (Context) => Context.returnApp(this.app, this.user)

  run_status = (_Context) => Promise.reject({message: "status is not yet implemented"})
  run_list   = (_Context) => Promise.reject({message: "list is not yet implemented"})
  run_add    = (_Context) => Promise.reject({message: "add is not yet implemented"})
  run_remove = (_Context) => Promise.reject({message: "remove is not yet implemented"})
}
