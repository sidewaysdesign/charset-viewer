function regTitleCase(str) {
  return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
}
function lowercaseConjunctions(str) {
  // return str
  // if (iOS()) return str
  return str.replace(/\b(This|To|Left|That|And|With|For|But|Or|So|Yet|Nor)\b/gi, txt => txt.toLowerCase()).replace(/^./, txt => txt.toUpperCase())
  // const lowerCaseRegex = new RegExp('/(?<!^)\bThis|The|To|That|And|With|For|But|Or|So|Yet|Nor\b/g')
  // prettier-ignore
  // return str.replace(lowerCaseRegex, txt => txt.toLowerCase())
  // function iOS() {
  //   return (
  //     ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
  //     (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  //   )
  // }
}
function hyphenTitleCase(str) {
  return regTitleCase(str)
    .split('-')
    .map(a => regTitleCase(a))
    .join('-')
}
export { regTitleCase, hyphenTitleCase, lowercaseConjunctions }
