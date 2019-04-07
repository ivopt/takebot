export default {
  userHasTakenApp: ({user, app}) => `⚠️ ${user} has taken \`${app}\` ⚠️`,
  userHasReturnedApp: ({user, app}) => `✅ ${user} has returned \`${app}\` ✅`
}
