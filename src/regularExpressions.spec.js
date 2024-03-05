import { createRegularExpression } from "./regularExpressions.js"

describe("createRegularExpression", () => {
  const testStrings = [
    "§§ 41, 46 Absatz 2",
    "§§ 13, 18 und 21",
    "§§ 393 bis 395",
    "§§ 26 und 27",
    "§§ 81, 263 Satz 1",
    "§§ 39, 65 Abs. 1 Satz 1",
    "§§ 21, 22, 24",
    "§§ 204, 206, 210, 211 und 212 Abs. 2 und 3",
    "§ 212 Abs. 2 und 3",
    "§§ 30, 31 und 42 Absatz 2",
    "§ 85 Absatz 2 bis 4",
    "§ 35a",
    "§ 80",
  ]

  for (const testString of testStrings) {
    test(testString, () => {
      const regExp = createRegularExpression()
      const match = regExp.exec(testString)
      expect(match).toBeTruthy()
      expect(match[0]).toEqual(testString)
    })
  }

  const leaveOut = [
    "Absatz 2 Nummer 1 bis 3, 11 und 12",
  ]

  for (const testString of leaveOut) {
    test("leave out " + testString, () => {
      const regExp = createRegularExpression()
      const match = regExp.exec(testString)
      expect(match).toBeNull()
    })
  }
})
