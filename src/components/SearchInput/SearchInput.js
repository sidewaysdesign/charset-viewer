import React, { useContext, useCallback, useMemo } from 'react'
import { unicodeNames, unicodeNumbers } from '../../unicode/UnicodeData'
import DispatchContext from '../../DispatchContext'
import DebouncedInput from '../../logic/DebouncedInput'
import { flagSet } from '../../logic/MultiCodePoints'

// import Pluralize from 'pluralize'
import Fuse from 'fuse.js'

function SearchInput({ query, onInputChange, placeholder }) {
  const searchAccuracy = 0.18
  const fuseMain = useMemo(() => {
    return new Fuse(unicodeNames, {
      minMatchCharLength: 2,
      limit: 800,
      threshold: searchAccuracy,
      includeScore: true
    })
  }, [unicodeNames, searchAccuracy])
  const fuseFlags = useMemo(() => {
    return new Fuse(flagSet, {
      keys: ['desc', 'abbr'],
      minMatchCharLength: 2,
      limit: 800,
      threshold: searchAccuracy,
      includeScore: true
    })
  }, [flagSet, searchAccuracy])

  const appDispatch = useContext(DispatchContext)
  let newquery = query
  const resetCurrentPage = useCallback(e => onInputChange(0), [onInputChange])
  function handleFieldChange(newquery) {
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
    const fuseMainResults = fuseMain.search(newquery).map(x => x.refIndex)

    const flagGlyphSearch = q => {
      const flagRegex = /[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]/g
      const allFlags = q.match(flagRegex)
      if (!allFlags) return []
      const collection = []
      allFlags.forEach(glyph => collection.push(Array.from(glyph).map(i => i.codePointAt())))
      return collection
    }
    const flagWordSearch = fuseFlags.search(newquery).map(x => x.item.sequence)
    results = [...fuseMainResults, ...flagWordSearch, ...flagGlyphSearch(newquery), ...new Set(codePointMatch(newquery))]
    if (results.length) {
      resetCurrentPage()
      appDispatch({ type: 'showsearchresults', results: results.filter(i => i > 0 || typeof i === 'object'), query: newquery })
    }
    return
  }

  return <DebouncedInput placeholder={placeholder} value={newquery} onDebouncedValChange={e => handleFieldChange(e)} delay={10} />
}

export default SearchInput
