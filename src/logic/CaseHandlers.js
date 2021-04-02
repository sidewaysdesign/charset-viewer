function regTitleCase(str) {
  return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
}
function lowercaseConjunctions(str) {
  // prettier-ignore
  return str.replace(/(?<!^)\bThis|That|And|With|For|But|Or|So|Yet|Nor\b/g, txt=>txt.toLowerCase())
}
function hyphenTitleCase(str) {
  return regTitleCase(str)
    .split('-')
    .map(a => regTitleCase(a))
    .join('-')
}
export { regTitleCase, hyphenTitleCase, lowercaseConjunctions }
