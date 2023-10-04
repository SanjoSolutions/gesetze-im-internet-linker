import { createVariants } from "./a.js"
import laws from "./laws.json"

export const gesetezbuchMapping = new Map([
  ["Bürgerlichen Gesetzbuches", "bgb"],
  ["Bürgerlichen Gesetzbuchs", "bgb"],
  ["Vermögensanlagengesetzes", "vermanlg"],
].concat(laws.flatMap(
  law => [
    [law.shortName, law.path],
    [law.name, law.path],
    ...createVariants(law.name).map(variant => [variant, law.path]),
  ],
)))
