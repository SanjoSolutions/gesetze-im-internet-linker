import { gesetezbuchMapping } from "./gesetezbuchMapping.js"
import {
  createRegularExpression,
  paragraphSpecification,
} from "./regularExpressions.js"

export function link() {
  const absaetze = document.querySelectorAll(".jurAbsatz")

  for (const absatz of absaetze) {
    linkInNode(absatz)
  }
}

export function linkInNode(node) {
  if (node instanceof Text) {
    const replacements = []
    const regExp = createRegularExpression()

    let match
    const textContent = node.textContent
    let lastIndex = 0

    function convertReferenceToLink(match) {
      const link = document.createElement("a")
      const gesetzesbuch = match[22]
      let path
      if (gesetzesbuch) {
        path = gesetezbuchMapping.get(gesetzesbuch)
      } else {
        path = retrievePath(window.location.pathname)
      }
      if (path) {
        if (match[0].startsWith("§")) {
          link.href =
            `https://www.gesetze-im-internet.de/${ path }/__${ match[2] }.html#${ match[1] }`
          link.target = "_blank"
          link.textContent = match[0]
          replacements.push(link)
        } else {
          const paragraph = node.parentElement.closest(".jnnorm")
            .querySelector(".jnenbez")
            .textContent
            .trim()
          if (paragraph) {
            link.href = `#${ paragraph } ${ match[0] }`
            link.textContent = match[0]
            replacements.push(link)
          } else {
            replacements.push(match[0])
          }
        }
      } else {
        replacements.push(match[0])
      }
    }

    function convertReferenceToLink2(match, path) {
      const link = document.createElement("a")
      const hash = "§ " + match[0]
      link.href =
        `https://www.gesetze-im-internet.de/${ path }/__${ match[1] }.html#${ hash }`
      link.textContent = match[0]
      link.target = "_blank"
      replacements.push(link)
    }

    while (match = regExp.exec(textContent)) {
      replacements.push(textContent.substring(lastIndex, match.index))

      if (match[0].startsWith("§§")) {
        const gesetzesbuch = match[81]
        let path
        if (gesetzesbuch) {
          path = gesetezbuchMapping.get(gesetzesbuch)
        } else {
          path = retrievePath(window.location.pathname)
        }
        if (path) {
          const regExp2 = new RegExp(paragraphSpecification, "g")
          let match2
          let lastIndex2 = 0
          const subText = match[0].substring(3)
          replacements.push(match[0].substring(0, 3))
          while (match2 = regExp2.exec(subText)) {
            replacements.push(subText.substring(lastIndex2, match2.index))
            convertReferenceToLink2(match2, path)
            lastIndex2 = match2.index + match2[0].length
          }
          replacements.push(subText.substring(lastIndex2, subText.length))
        } else {
          replacements.push(match[0])
        }
      } else {
        convertReferenceToLink(match)
      }

      lastIndex = match.index + match[0].length
    }
    replacements.push(textContent.substring(lastIndex, textContent.length))
    if (replacements.length >= 2) {
      node.replaceWith(...replacements)
    }
  } else {
    const childNodes = Array.from(node.childNodes)
    for (const childNode of childNodes) {
      linkInNode(childNode)
    }
  }
}

function retrievePath(path) {
  return path.split("/")[1]
}
