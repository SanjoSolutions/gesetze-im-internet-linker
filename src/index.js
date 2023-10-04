import { link } from "./link.js"
import {
  createSingleParagraphRegularExpression,
} from "./regularExpressions.js"

const highlightColor = "#d4d5ff"

function highlightReferred() {
  const text = decodeURIComponent(window.location.hash.substring(1))
  console.log(text)
  const regExp = createSingleParagraphRegularExpression()
  const match = regExp.exec(text)
  if (match) {
    const absätzeToHighlight = []
    {
      const absatzFrom = parseInt(match[23], 10)
      const absatzTo = parseInt(match[8], 10)
      if (absatzFrom && absatzTo) {
        if (absatzFrom <= absatzTo) {
          for (let absatz = absatzFrom; absatz <= absatzTo; absatz++) {
            absätzeToHighlight.push(absatz)
          }
        }
      } else {
        const absatz = parseInt(match[23], 10)
        if (absatz) {
          absätzeToHighlight.push(absatz)
        }
      }
    }
    {
      const absatz = parseInt(match[7], 10)
      if (absatz) {
        absätzeToHighlight.push(absatz)
      }
    }
    if (absätzeToHighlight.length >= 1) {
      let elementToScrollTo = null
      for (const absatz of absätzeToHighlight) {
        const satz = parseInt(match[4], 10)
        const absätze = Array.from(document.querySelectorAll(
          ".jnhtml .jurAbsatz"))
        const $absatz = absätze[absatz - 1]
        if (satz) {
          let currentSentence = 1
          const match = /^(\(\d+\) )(.+)$/.exec($absatz.innerHTML)
          if (match) {
            const sentences = match[2]
            $absatz.innerHTML = match[1] +
              sentences.replaceAll(/[^ ].*?\./g, (match) => {
                let result
                if (currentSentence === satz) {
                  result =
                    `<span style="background-color: ${ highlightColor }">${ match }</span>`
                } else {
                  result = match
                }

                currentSentence++

                return result
              })
            if (!elementToScrollTo) {
              elementToScrollTo = $absatz
            }
          }
        } else {
          $absatz.style.backgroundColor = highlightColor
          if (!elementToScrollTo) {
            elementToScrollTo = $absatz
          }
        }
      }
      if (elementToScrollTo) {
        setTimeout(() => elementToScrollTo.scrollIntoView(false, {
          block: "end",
          inline: "nearest",
          behavior: "instant",
        }), 100)
      }
    } else {
      const container = document.getElementById("container")
      container.style.backgroundColor = highlightColor
    }
  }
}

highlightReferred()
link()

window.addEventListener("hashchange", function () {
  highlightReferred()
})

