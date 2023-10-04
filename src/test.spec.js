/**
 * @jest-environment-options {"url": "https://www.gesetze-im-internet.de/hgb/BJNR002190897.html"}
 */

import { linkInNode } from "./link.js"

describe("", () => {
  test("", () => {
    const html = "§§ 108 bis 123"
    document.body.innerHTML = html
    linkInNode(document.body)
    expect(document.body.innerHTML)
      .toEqual(
        "§§ <a href=\"https://www.gesetze-im-internet.de/hgb/__108.html#§ 108\" target=\"_blank\">108</a> bis <a href=\"https://www.gesetze-im-internet.de/hgb/__123.html#§ 123\" target=\"_blank\">123</a>")
  })

  test("", () => {
    const html = "§ 204 des Bürgerlichen Gesetzbuches"
    document.body.innerHTML = html
    linkInNode(document.body)
    expect(document.body.innerHTML)
      .toEqual(
        "<a href=\"https://www.gesetze-im-internet.de/bgb/__204.html#§ 204\" target=\"_blank\">§ 204 des Bürgerlichen Gesetzbuches</a>")
  })

  test("", () => {
    const html = "§§ 204 und 206 des Bürgerlichen Gesetzbuches"
    document.body.innerHTML = html
    linkInNode(document.body)
    expect(document.body.innerHTML)
      .toEqual(
        "§§ <a href=\"https://www.gesetze-im-internet.de/bgb/__204.html#§ 204\" target=\"_blank\">204</a> und <a href=\"https://www.gesetze-im-internet.de/bgb/__206.html#§ 206\" target=\"_blank\">206</a> des Bürgerlichen Gesetzbuches")
  })

  test("", () => {
    const html = `<div class"jnnorm"><div class="jnheader"><h3><span class="jnenbez">§ 8b</span></h3></div><div class="text">Absatz 2 Nummer 1 bis 3, 11 und 12</div></div>`
    document.body.innerHTML = html
    const text = document.body.querySelector(".text")
    linkInNode(text)
    expect(text.innerHTML)
      .toEqual(
        "<a href=\"#§ 8b Absatz 2 Nummer 1 bis 3, 11 und 12\">Absatz 2 Nummer 1 bis 3, 11 und 12</a>")
  })
})
