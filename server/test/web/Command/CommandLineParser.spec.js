import CommandLineParser from '#/src/web/Command/CommandLineParser'

describe('CommandLineParser', () => {
  it('given a command line, returns an object with name, app and options', () => {
    const commandLine = 'return AppA --opt1 valopt1 --opt2 valopt2'

    const parsedCommand = CommandLineParser.parse(commandLine)

    expect(parsedCommand.name).toEqual('return')
    expect(parsedCommand.app).toEqual('AppA')
    expect(parsedCommand.options).toEqual({opt1: 'valopt1', opt2: 'valopt2'})
  })

  it('given a command line with too many extra white spaces, returns an object with name, app and options', () => {
    const commandLine = '    return     AppA   --opt1  valopt1 --opt2 valopt2    '

    const parsedCommand = CommandLineParser.parse(commandLine)

    expect(parsedCommand.name).toEqual('return')
    expect(parsedCommand.app).toEqual('AppA')
    expect(parsedCommand.options).toEqual({opt1: 'valopt1', opt2: 'valopt2'})
  })
})
