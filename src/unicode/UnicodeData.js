import raw from 'raw.macro'

const uniCodePos = 0
const uniNamePos = 1
export const unicodeData = raw('./UnicodeData.txt')
  .replace(/^\s+|\s+$/g, '')
  .split('\n')
const unicodeObjectOfIndices = {}
export const unicodeNames = unicodeData.map(a => a.split(';')[uniNamePos])
export const unicodeNumbers = unicodeData.map(a => a.split(';')[uniCodePos])
unicodeNumbers.forEach((a, idx) => (unicodeObjectOfIndices[a] = idx))
export const unicodeObj = unicodeObjectOfIndices
// export const unicodeObj = unicodeData.reduce((acc, cur, idx) => ({ ...acc, [cur.split(';')[0]]: idx }), {})
