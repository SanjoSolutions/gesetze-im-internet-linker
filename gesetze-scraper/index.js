import { writeJSON } from "@sanjo/write-json"
import puppeteer from "puppeteer"

const browser = await puppeteer.launch({
  headless: "new",
})
const page = await browser.newPage()
const pages = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "1", "2", "3", "4", "5", "6", "7", "8", "9",
]
const laws = []
for (const character of pages) {
  await page.goto(`https://www.gesetze-im-internet.de/Teilliste_${ character }.html`)
  const elements = await page.$$("#paddingLR12 > p")
  for (const element of elements) {
    const link = await element.$("a")
    const path = await link.evaluate(link => new URL(link.href).pathname.split(
      "/")[1])
    const shortName = await link.evaluate(link => link.textContent.trim())
    const name = await element.evaluate(element => element.childNodes[2].textContent.trim())
    laws.push({
      shortName,
      name,
      path,
    })
  }
}

await writeJSON("../src/laws.json", laws)

await browser.close()
