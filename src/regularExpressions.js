export const regexp = String.raw

export const satz = regexp`Satz (\d+)`
export const numberExpression = regexp`(?:([\da-z]+)|([\da-z]+) bis ([\da-z]+))`
export const numberExpressionList = generateListExpression(numberExpression)

export const numberReference = regexp`Nummer[  ]${numberExpressionList}`

function generateListExpression(expression, moreThanOnce = false) {
  return regexp`${expression}(?:(?:, | und | u\. | bis )${expression})${moreThanOnce ? "+" : "*"}`
}

export const absatzSpecification = regexp`(\d+)(?:[  ](?:${satz}(?:[  ]${numberReference}(?:[  ]Satz[  ](\d+))?)?|(?:und|u\.)[  ](\d+)|bis[  ](\d+)|${numberReference}|${satz}))?`
export const absatzList = regexp`(?:Absatz|Abs\.)[  ]` +
  generateListExpression(absatzSpecification)
export const paragraphSpecification = regexp`(\d+[a-z]?)(?:[  ](?:${absatzList}|${satz}))?`
export const gesetzbuchReference = regexp`[  ]des[  ]([${escapeRegExpText(" \"()*,-/0123456789:ABCDEFGHIJKLMNOPQRSTUVWXZ[]abcdefghijklmnopqrstuvwxyz §ÄÉÖÜßäéöü–—“„")}]+)`
export const singleParagraphRegularExpression = regexp`((?<!§)§(?!§)[  ]${paragraphSpecification})`
export const multiParagraphRegularExpression = regexp`§§[  ]${generateListExpression(paragraphSpecification, true)}`

function escapeRegExpText(text) {
  return text.replace(/[\[\]().*+\\\-]/g, (character) => `\\${ character }`)
}

export function createSingleParagraphRegularExpression() {
  return new RegExp(singleParagraphRegularExpression, "g")
}

export function createMultiParagraphRegularExpression() {
  return new RegExp(
    multiParagraphRegularExpression,
    "g",
  )
}

export function createRegularExpression() {
  return new RegExp(
    regexp`${singleParagraphRegularExpression}|${multiParagraphRegularExpression}`,
    "g",
  )
}
