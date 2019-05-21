import Command from '../../../src/web/Command/Command'

describe('Command', () => {
  let Context

  beforeEach(() => {
    Context = {
      takeApp: jest.fn(),
      returnApp: jest.fn()
    }
  })

  it('runs the "take" command', () => {
    const command = new Command('ivo', 'take appA')
    command.run(Context)
    expect(Context.takeApp).toBeCalledWith('appA', 'ivo')
  })

  it('runs the "return" command', () => {
    const command = new Command('ivo', 'return appA')
    command.run(Context)
    expect(Context.returnApp).toBeCalledWith('appA', 'ivo')
  })

  it('fails with "Invalid command" when issued an invalid command', async () => {
    const command = new Command('ivo', 'invalid command')

    try {
      await command.run(Context)
      fail('shouldnt have reached this point')
    } catch (error) {
      expect(error.message).toEqual('Invalid command')
    }
  })

  it.skip('fails with "not yet implemented" when issued the status command', async () => {
    const command = new Command('ivo', 'status')

    try {
      await command.run(Context)
      fail('shouldnt have reached this point')
    } catch (error) {
      expect(error.message).toMatch(/not yet implemented/)
    }
  })

  it('fails with "not yet implemented" when issued the list command', async () => {
    const command = new Command('ivo', 'list')

    try {
      await command.run(Context)
      fail('shouldnt have reached this point')
    } catch (error) {
      expect(error.message).toMatch(/not yet implemented/)
    }
  })

  it('fails with "not yet implemented" when issued the add command', async () => {
    const command = new Command('ivo', 'add')

    try {
      await command.run(Context)
      fail('shouldnt have reached this point')
    } catch (error) {
      expect(error.message).toMatch(/not yet implemented/)
    }
  })

  it('fails with "not yet implemented" when issued the remove command', async () => {
    const command = new Command('ivo', 'remove')

    try {
      await command.run(Context)
      fail('shouldnt have reached this point')
    } catch (error) {
      expect(error.message).toMatch(/not yet implemented/)
    }
  })
})
