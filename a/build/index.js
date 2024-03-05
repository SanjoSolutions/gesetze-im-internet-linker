(() => {
  // src/regularExpressions.js
  var regexp = String.raw;
  var satz = regexp`Satz (\d+)`;
  var numberExpression = regexp`(?:([\da-z]+)|([\da-z]+) bis ([\da-z]+))`;
  var numberExpressionList = generateListExpression(numberExpression);
  var numberReference = regexp`Nummer[  ]${numberExpressionList}`;
  function generateListExpression(expression, moreThanOnce = false) {
    return regexp`${expression}(?:(?:, | und | u\. | bis )${expression})${moreThanOnce ? "+" : "*"}`;
  }
  var absatzSpecification = regexp`(\d+)(?:[  ](?:${satz}(?:[  ]${numberReference}(?:[  ]Satz[  ](\d+))?)?|(?:und|u\.)[  ](\d+)|bis[  ](\d+)|${numberReference}|${satz}))?`;
  var absatzList = regexp`(?:Absatz|Abs\.)[  ]` + generateListExpression(absatzSpecification);
  var paragraphSpecification = regexp`(\d+[a-z]?)(?:[  ](?:${absatzList}|${satz}))?`;
  var gesetzbuchReference = regexp`[  ]des[  ]([${escapeRegExpText(' "()*,-/0123456789:ABCDEFGHIJKLMNOPQRSTUVWXZ[]abcdefghijklmnopqrstuvwxyz \xA7\xC4\xC9\xD6\xDC\xDF\xE4\xE9\xF6\xFC\u2013\u2014\u201C\u201E')}]+)`;
  var singleParagraphRegularExpression = regexp`((?<!§)§(?!§)[  ]${paragraphSpecification})`;
  var multiParagraphRegularExpression = regexp`§§[  ]${generateListExpression(paragraphSpecification, true)}`;
  function escapeRegExpText(text) {
    return text.replace(/[\[\]().*+\\\-]/g, (character) => `\\${character}`);
  }
  function createSingleParagraphRegularExpression() {
    return new RegExp(singleParagraphRegularExpression, "g");
  }
  function createRegularExpression() {
    return new RegExp(
      regexp`${singleParagraphRegularExpression}|${multiParagraphRegularExpression}`,
      "g"
    );
  }

  // src/link.js
  function link() {
    const absaetze = document.querySelectorAll(".jurAbsatz");
    for (const absatz of absaetze) {
      linkInNode(absatz);
    }
  }
  function linkInNode(node) {
    if (node instanceof Text) {
      let convertReferenceToLink = function(match2) {
        const link2 = document.createElement("a");
        const path = retrievePath(window.location.pathname);
        link2.href = `https://www.gesetze-im-internet.de/${path}/__${match2[2]}.html#${match2[1]}`;
        link2.target = "_blank";
        link2.textContent = match2[0];
        replacements.push(link2);
      }, convertReferenceToLink2 = function(match2, path) {
        const link2 = document.createElement("a");
        const hash = "\xA7 " + match2[0];
        link2.href = `https://www.gesetze-im-internet.de/${path}/__${match2[1]}.html#${hash}`;
        link2.textContent = match2[0];
        link2.target = "_blank";
        replacements.push(link2);
      };
      const replacements = [];
      const regExp = createRegularExpression();
      let match;
      const textContent = node.textContent;
      let lastIndex = 0;
      while (match = regExp.exec(textContent)) {
        replacements.push(textContent.substring(lastIndex, match.index));
        if (textContent.substring(
          match.index + match[0].length,
          match.index + match[0].length + " des ".length
        ) === " des ") {
          replacements.push(match[0]);
        } else {
          if (match[0].startsWith("\xA7\xA7")) {
            const path = retrievePath(window.location.pathname);
            const regExp2 = new RegExp(paragraphSpecification, "g");
            let match2;
            let lastIndex2 = 0;
            const subText = match[0].substring(3);
            replacements.push(match[0].substring(0, 3));
            while (match2 = regExp2.exec(subText)) {
              replacements.push(subText.substring(lastIndex2, match2.index));
              convertReferenceToLink2(match2, path);
              lastIndex2 = match2.index + match2[0].length;
            }
            replacements.push(subText.substring(lastIndex2, subText.length));
          } else {
            convertReferenceToLink(match);
          }
        }
        lastIndex = match.index + match[0].length;
      }
      replacements.push(textContent.substring(lastIndex, textContent.length));
      if (replacements.length >= 2) {
        node.replaceWith(...replacements);
      }
    } else {
      const childNodes = Array.from(node.childNodes);
      for (const childNode of childNodes) {
        linkInNode(childNode);
      }
    }
  }
  function retrievePath(path) {
    return path.split("/")[1];
  }

  // src/index.js
  var highlightColor = "#d4d5ff";
  function highlightReferred() {
    const text = decodeURIComponent(window.location.hash.substring(1));
    const regExp = createSingleParagraphRegularExpression();
    const match = regExp.exec(text);
    if (match) {
      const abs\u00E4tzeToHighlight = [];
      {
        const absatzFrom = parseInt(match[23], 10);
        const absatzTo = parseInt(match[8], 10);
        if (absatzFrom && absatzTo) {
          if (absatzFrom <= absatzTo) {
            for (let absatz = absatzFrom; absatz <= absatzTo; absatz++) {
              abs\u00E4tzeToHighlight.push(absatz);
            }
          }
        } else {
          const absatz = parseInt(match[23], 10);
          if (absatz) {
            abs\u00E4tzeToHighlight.push(absatz);
          }
        }
      }
      {
        const absatz = parseInt(match[7], 10);
        if (absatz) {
          abs\u00E4tzeToHighlight.push(absatz);
        }
      }
      if (abs\u00E4tzeToHighlight.length >= 1) {
        let elementToScrollTo = null;
        for (const absatz of abs\u00E4tzeToHighlight) {
          const satz2 = parseInt(match[4], 10);
          const abs\u00E4tze = Array.from(document.querySelectorAll(
            ".jnhtml .jurAbsatz"
          ));
          const $absatz = abs\u00E4tze[absatz - 1];
          if (satz2) {
            let currentSentence = 1;
            const match2 = /^(\(\d+\) )(.+)$/.exec($absatz.innerHTML);
            if (match2) {
              const sentences = match2[2];
              $absatz.innerHTML = match2[1] + sentences.replaceAll(/[^ ].*?\./g, (match3) => {
                let result;
                if (currentSentence === satz2) {
                  result = `<span style="background-color: ${highlightColor}">${match3}</span>`;
                } else {
                  result = match3;
                }
                currentSentence++;
                return result;
              });
              if (!elementToScrollTo) {
                elementToScrollTo = $absatz;
              }
            }
          } else {
            $absatz.style.backgroundColor = highlightColor;
            if (!elementToScrollTo) {
              elementToScrollTo = $absatz;
            }
          }
        }
        if (elementToScrollTo) {
          setTimeout(() => elementToScrollTo.scrollIntoView(false, {
            block: "end",
            inline: "nearest",
            behavior: "instant"
          }), 100);
        }
      } else {
        const container = document.getElementById("container");
        container.style.backgroundColor = highlightColor;
      }
    }
  }
  highlightReferred();
  link();
})();
