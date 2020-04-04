export default {
  userHasTakenApp: ({user, app}) => `⚠️ ${user} has taken \`${app}\` ⚠️`,
  userHasReturnedApp: ({user, app}) => `✅ ${user} has returned \`${app}\` ✅`,
  appIsFree: () => `✅ is free`,
  appTakenBy: (user) => `⛔ taken by ${user}`,
  areYouDoneWith: (app) => `Are you done with \`${app}\`?`,
  appHasBeenRemoved: ({app}) => `\`${app}\` has been removed`
}
