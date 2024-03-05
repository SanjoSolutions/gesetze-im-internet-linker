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
      const path = retrievePath(window.location.pathname)
      link.href =
        `https://www.gesetze-im-internet.de/${ path }/__${ match[2] }.html#${ match[1] }`
      link.target = "_blank"
      link.textContent = match[0]
      replacements.push(link)
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

      if (textContent.substring(
          match.index + match[0].length,
          match.index + match[0].length + " des ".length,
        ) ===
        " des ") {
        replacements.push(match[0])
      } else {
        if (match[0].startsWith("§§")) {
          const path = retrievePath(window.location.pathname)
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
          convertReferenceToLink(match)
        }
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
