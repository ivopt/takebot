const parseOptions = (optionPairs) => {
  if (optionPairs.length < 2) return {}

  const [option, value, ...rest] = optionPairs
  return Object.assign(parseOptions(rest), {[option.substr(2)]: value})
}

export default {
  parse: (commandLine) => {
    const [name, app, ...options] = commandLine.replace(/\s+/g, " ") // remove multiple whitespaces
                                               .replace(/(^ *| *$)/g, "") // remove wh padding on the start/end
                                               .split(" ")
    return { name, app, options: parseOptions(options) }
  }
}
