import { NotifyTeam } from '#/src/core/notifications/UseCases'

class MockedNotifier {
  constructor(notifyTeamMock) {
    this.notifyTeam = notifyTeamMock
  }
}

describe('SetReminder', () => {
  const messageTemplate = () => "mocked message"
  const notifyTeamMock = jest.fn()
  const mockedNotifier = new MockedNotifier(notifyTeamMock)

  let notifyTeam

  beforeEach(() => {
    notifyTeamMock.mockReset()
    notifyTeam = NotifyTeam(mockedNotifier, messageTemplate)
  })

  it('notifies the team about app being returned', async () => {
    await notifyTeam({app: "appA", user: "ivo"})
    expect(notifyTeamMock.mock.calls.length).toEqual(1)
    expect(notifyTeamMock.mock.calls[0][0]).toMatch("mocked message")
  })
})
