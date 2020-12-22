import React, { useContext, useCallback } from 'react'
import DispatchContext from '../../DispatchContext'
import { unicodeNames, unicodeNumbers } from '../../unicode/UnicodeData'
import Pluralize from 'pluralize'

function SearchInput({ query, isSplitSeries, onInputChange }) {
  const appDispatch = useContext(DispatchContext)
  let newquery = query
  const resetCurrentPage = useCallback(e => onInputChange(0), [onInputChange])
  function handleFieldChange(e) {
    const newquery = e.target.value
    if (newquery.length === 0) {
      appDispatch({ type: 'showsearchresults', value: [], query: newquery })
      appDispatch({ type: 'defaultmodeupdate', value: 'auto' })
      return
    }
    // const emo_test = q => /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a 9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/.test(q)
    let results = []

    const alphaTest = q => /^[\w -]+$/.test(q)
    // const wordTest = q => /^\b[\w -]+$/.test(q)
    // const firstWholeWordTest = q => /[\w -]+?\b[\w -]+?$/.test(q)
    const firstWholeWord = q => {
      const localResults = []
      const variations = [...new Set([Pluralize.singular(q), Pluralize.plural(q)])]
      variations.forEach(w => {
        const firstWordRegex = new RegExp(`\\b${w}\\b`)
        console.log('firstWordRegex ->', firstWordRegex)
        unicodeNames.forEach((el, index) => {
          if (firstWordRegex.test(el)) localResults.push(index) // checks for exact match with whole first word; assumes user is still typing second word
        })
      })
      const cleanedLocal = [...new Set(localResults.filter(num => num === parseInt(num)))]

      console.log('firstWholeWord RESULTS', cleanedLocal)
      return cleanedLocal
    }
    const rawMatch = q => {
      console.log('rawMatch')
      return unicodeNames.map((el, index) => (el.includes(newquery.toUpperCase()) ? index : false)).filter(el => el)
    }

    const codePointMatch = q => {
      const utf8String = Array.from(q)
      // console.log('utf8String IN <--', utf8String)
      utf8String.map(glyph => {
        results.push(unicodeNumbers.findIndex(el => el === glyph.codePointAt().toString(16).toUpperCase().padStart(4, '0')))
      })
      // console.log('utf8String OUT -->', utf8String)
      return results
    }
    // if (alphaTest(newquery) && newquery.length > 1) {
    /* SEARCH BY DESCRIPTIVE NAME */
    // if (firstWholeWordTest(newquery)) {
    results = [...firstWholeWord(newquery.toUpperCase())]
    /* assumes user is looking for specific phrase and has started typing second word */
    // } // results = rawMatch(newquery)
    // results = codePointMatch(newquery)
    results = [...codePointMatch(newquery)]

    // if (results.length && isSplitSeries) {
    // results = [...new Set(results)]
    // }
    // }
    // if (isSplitSeries === 'glyph' || 1 == 1) {
    //   // if (isSplitSeries === 'glyph' || 1 == 1) {
    //   results = codePointMatch(newquery)
    // }
    console.log('results', results)
    if (results.length) {
      resetCurrentPage()
      appDispatch({ type: 'showsearchresults', results: results, query: newquery })
    }
    return
  }
  return <input className="main_input" type="text" value={newquery} onChange={handleFieldChange} />
}

export default SearchInput
