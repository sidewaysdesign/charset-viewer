import raw from 'raw.macro'

const uniCodePos = 0
const uniNamePos = 1
export const unicodeData = raw('./UnicodeData.txt')
  // export const unicodeData = raw('./UnicodeDataSmall.txt')
  .replace(/^\s+|\s+$/g, '')
  .split('\n')
export const unicodeNames = unicodeData.map(a => a.split(';')[uniNamePos])
export const unicodeNumbers = unicodeData.map(a => a.split(';')[uniCodePos])
