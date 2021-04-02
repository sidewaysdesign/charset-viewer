import React, { useContext, useCallback } from 'react'
import DispatchContext from '../../DispatchContext'
import { unicodeNames, unicodeNumbers } from '../../unicode/UnicodeData'
// import Pluralize from 'pluralize'
import Fuse from 'fuse.js'

function SearchInput({ query, isSplitSeries, onInputChange }) {
  const fuse = new Fuse(unicodeNames, {
    minMatchCharLength: 3,
    limit: 500,
    threshold: 0.18,
    includeScore: true
  })
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
    let results = []

    const codePointMatch = q => {
      const utf8String = Array.from(q)
      utf8String.forEach(glyph => {
        results.push(unicodeNumbers.findIndex(el => el === glyph.codePointAt().toString(16).toUpperCase().padStart(4, '0')))
      })
      return results
    }
    const fuseresults = fuse.search(newquery).map(x => x.refIndex)

    results = [...fuseresults, ...codePointMatch(newquery)]
    if (results.length) {
      resetCurrentPage()
      appDispatch({ type: 'showsearchresults', results: results, query: newquery })
    }
    return
  }
  return <input className="main_input" type="text" value={newquery} onChange={handleFieldChange} />
}

export default SearchInput
