const parseOptions = (optionPairs) => {
  if (optionPairs.length < 2) return {}

  const [option, value, ...rest] = optionPairs
  return Object.assign(parseOptions(rest), {[option.substr(2)]: value})
}

export default {
  parse: (commandLine) => {
    const [name, app, ...options] = commandLine.split(" ")
    return { name, app, options: parseOptions(options) }
  }
}
