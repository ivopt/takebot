import parse from 'parse-duration'

export default {
  parse: (commandLine) => {
    const [name, app, lease, ] =
      commandLine.replace(/\s+/g, " ") // remove multiple whitespaces
                 .replace(/(^ *| *$)/g, "") // remove padding on the start/end
                 .split(" ")
    return { name, app, lease: parse(lease) }
  }
}
