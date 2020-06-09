import CommandLineParser from '#/src/web/Command/CommandLineParser'

describe('CommandLineParser', () => {
  it('return an object with all known components of the command', () => {
    const commandLine = 'take appA 45m'
    const parsedCommand = CommandLineParser.parse(commandLine)

    expect(parsedCommand.name).toEqual('take')
    expect(parsedCommand.app).toEqual('appA')
    expect(parsedCommand.lease).toEqual(2700000)
  })

  it('lease is optional', () => {
    const commandLine = 'return AppA'
    const parsedCommand = CommandLineParser.parse(commandLine)

    expect(parsedCommand.name).toEqual('return')
    expect(parsedCommand.app).toEqual('AppA')
    expect(parsedCommand.lease).toBeNull()
  })

  it('handles too many whitespaces properly', () => {
    const commandLine = '    return     AppA   '
    const parsedCommand = CommandLineParser.parse(commandLine)

    expect(parsedCommand.name).toEqual('return')
    expect(parsedCommand.app).toEqual('AppA')
  })
})
