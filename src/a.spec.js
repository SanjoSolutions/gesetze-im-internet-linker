import { a, createVariants } from "./a.js"

describe("a", () => {
  test("", () => {
    expect(a("Gesetz zu dem Zusatzabkommen"))
      .toEqual("Gesetzes zu dem Zusatzabkommen")
  })
})

describe("createVariants", () => {
  it("creates variants", () => {
    expect(createVariants("Gesetz zu dem Zusatzabkommen")).toEqual([
      "Gesetzes zu dem Zusatzabkommen",
    ])
  })
})
