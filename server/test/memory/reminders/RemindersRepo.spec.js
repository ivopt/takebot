import RemindersRepo from "#/src/memory/reminders/RemindersRepo"

describe("RemindersRepo", () => {
  let remindersRepo

  beforeEach(() => {
    remindersRepo = new RemindersRepo()
  })

  describe("#all", () => {
    it("gives me an empty list on an empty repo", async () => {
      expect(await remindersRepo.all()).toEqual({})
    })

    it("gives back a map of all existing reminders", async () => {
      const existing = { appA: 123, appB: 234 }
      Object.assign(remindersRepo.reminders, existing)

      expect(await remindersRepo.all()).toEqual(existing)
    })
  })

  describe("#add", () => {
    it("adds a new reminder", async () => {
      await remindersRepo.add("appA", { user: "jack", message: "random" })
      expect(Object.keys(await remindersRepo.all())).toContain("appA")
    })

    it("refuses to add an already existing reminder", async () => {
      await remindersRepo.add("appA", { user: "jack", message: "random" })

      try {
        await remindersRepo.add("appA", { user: "jack", message: "random2" })
        fail("Expecting to throw and it didn't")
      } catch(error) {
        expect(error).toEqual("Reminder is already set")
      }
    })
  })

  describe("#find", () => {
    it("finds the details for a reminder", async () => {
      await remindersRepo.add("appA", { user: "jack", message: "random" })
      expect(await remindersRepo.find("appA")).toEqual({ app: "appA", user: "jack", message: "random" })
    })

    it("when the app does not exist, returns undefined", async () => {
      expect(await remindersRepo.find("appZ")).toBeUndefined()
    })
  })

  describe("#remove", () => {
    it("removes a reminder", async () => {
      const timeout = setTimeout(()=>{}, 200)
      await remindersRepo.add("appA", { user: "jack", message: "random" })
      expect(await remindersRepo.find("appA")).toEqual({ app: "appA", user: "jack", message: "random" })

      await remindersRepo.remove("appA")
      expect(await remindersRepo.find("appA")).toBeUndefined()
    })
  })
})
