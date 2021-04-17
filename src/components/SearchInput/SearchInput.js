import React, { useContext, useCallback, useMemo, useEffect } from 'react'
import { unicodeNames, unicodeObj } from '../../unicode/UnicodeData'
import DispatchContext from '../../DispatchContext'
import DebouncedInput from '../../logic/DebouncedInput'
import { flagSet } from '../../logic/MultiCodePoints'
import useQueryParam from '../../logic/QueryParameters'
import { decodeEntities } from '../../logic/DerivedAttributes'

// import Pluralize from 'pluralize'
import Fuse from 'fuse.js'

function SearchInput({ query, onInputChange, placeholder }) {
  var t1, t2
  const [search, setSearch] = useQueryParam('s', '')
  useEffect(() => {
    if (search !== '') {
      handleFieldChange(decodeURIComponent(search))
    }
  }, [])
  const searchAccuracy = 0.25
  const fuseMain = useMemo(() => {
    return new Fuse(unicodeNames, {
      minMatchCharLength: 3,
      limit: 800,
      threshold: searchAccuracy,
      includeScore: true
    })
  }, [searchAccuracy])
  const fuseFlags = useMemo(() => {
    return new Fuse(flagSet, {
      keys: ['desc', 'altdesc', 'abbr'],
      minMatchCharLength: 2,
      limit: 800,
      threshold: searchAccuracy,
      includeScore: true
    })
  }, [flagSet, searchAccuracy])
  const appDispatch = useContext(DispatchContext)

  let newquery = search !== '' ? decodeURIComponent(search) : query
  const resetCurrentPage = useCallback(e => onInputChange(0), [onInputChange])
  function handleFieldChange(newquery) {
    const noentityquery = newquery.replace(/&#[0-9]{1,6};|&[a-z]+;/g, '')
    if (newquery.length === 0) {
      appDispatch({ type: 'showsearchresults', value: [], query: newquery })
      appDispatch({ type: 'defaultmodeupdate', value: 'auto' })
      return
    }
    let results = []
    const literalEntities = q => {
      const queryEntities = q.match(/&#[0-9]{1,6};|&[a-z]+;/g)
      if (queryEntities) {
        const nonRedundant = new Set(queryEntities)
        return queryEntities.map(i => unicodeObj[decodeEntities(i).codePointAt(0).toString(16).toUpperCase().padStart(4, '0')])
      }
      return []
    }

    const codePointMatch = q => {
      const utf8String = new Set(Array.from(q))
      utf8String.forEach(glyph => {
        results.push(unicodeObj[glyph.codePointAt().toString(16).toUpperCase().padStart(4, '0')])
      })
      return results
    }
    const flagGlyphSearch = q => {
      const flagRegex = /[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]/g
      const allFlags = q.match(flagRegex)
      if (!allFlags) return []
      const collection = []
      allFlags.forEach(glyph => collection.push(Array.from(glyph).map(i => i.codePointAt())))
      return collection
    }
    const fuseMainResults = fuseMain.search(noentityquery).map(x => x.refIndex)
    const flagWordSearch = fuseFlags.search(noentityquery).map(x => x.item.sequence)
    results = [...new Set([...flagGlyphSearch(newquery), ...literalEntities(newquery), ...flagWordSearch, ...fuseMainResults, ...codePointMatch(newquery)])]
    if (results.length) {
      resetCurrentPage()
      appDispatch({ type: 'showsearchresults', results: results.filter(i => i > 0 || typeof i === 'object'), query: newquery })
    }
    setSearch(encodeURIComponent(newquery))

    return
  }
  return <DebouncedInput placeholder={placeholder} value={newquery} onDebouncedValChange={e => handleFieldChange(e)} delay={200} />
}

export default SearchInput
