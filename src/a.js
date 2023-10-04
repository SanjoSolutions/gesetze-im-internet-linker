export function a(text) {
  if (text.startsWith("Gesetz ")) {
    const text2 = text
      .replace(/^Gesetz /, "Gesetzes ")
      .replaceAll("gesetz\b", "gesetzes")
    return text2
  }
}

export function createVariants(text) {
  return [
    a(text),
  ]
}
