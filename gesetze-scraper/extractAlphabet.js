import { readJSON } from "@sanjo/read-json"

const laws = await readJSON("../src/laws.json")
const alphabet = new Set()
for (const law of laws) {
  for (const character of law.name) {
    alphabet.add(character)
  }
}
const array = Array.from(alphabet)
debugger
array.sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
console.log(array.join(""))
