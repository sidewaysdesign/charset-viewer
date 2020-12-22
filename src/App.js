import React, { useState, useEffect } from 'react'
// import { useDebounce } from 'use-debounce'
import Paginators from './components/Paginators/Paginators'
import GlyphCard from './components/GlyphCard/GlyphCard'
import SearchInput from './components/SearchInput/SearchInput'
import SearchMode from './components/SearchMode/SearchMode'
import { unicodeData } from './unicode/UnicodeData'
import StateContext from './StateContext'
import DispatchContext from './DispatchContext'
import { useImmerReducer } from 'use-immer'
import AnimateHeight from 'react-animate-height'

import './App.css'
const Entities = require('html-entities').AllHtmlEntities

const initialResultsPerPage = 24

const useStateWithLocalStorage = localStorageKey => {
  const [value, setValue] = useState(localStorage.getItem(localStorageKey) || true)
  useEffect(() => localStorage.setItem(localStorageKey, value), [value])
  return [value, setValue]
}
const savedUI = JSON.parse(localStorage.getItem('uiStorage'))

function App() {
  const [currentPage, setCurrentPage] = useState(0)
  const [resultsPerPage, setResultsPerPage] = useState(initialResultsPerPage)
  // const [results, setResults] = useState([])
  const [glyphsToggle, setGlyphsToggle] = useStateWithLocalStorage('glyphsToggle')
  const [entitiesToggle, setEntitiesToggle] = useStateWithLocalStorage('entitiesToggle')

  const originalState = {
    query: '',
    isSplitSeries: true,
    results: []
  }

  const [uiStorage, setUiStorage] = useState(
    JSON.parse(localStorage.getItem('uiStorage')) || {
      glyphs: true,
      htmlEntities: false
    }
  )

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('uiStorage'))
    if (uiStorage) {
      setUiStorage(uiStorage)
    }
  }, [])

  useEffect(() => {
    console.log('STORING?', uiStorage, JSON.stringify(uiStorage))
    localStorage.setItem('uiStorage', JSON.stringify(uiStorage))
  }, [uiStorage])

  const [state, dispatch] = useImmerReducer(ourReducer, originalState)

  function ourReducer(draft, action) {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case 'showsearchresults':
        draft.results = action.results
        draft.query = action.query
        return
      case 'splitseries':
        draft.isSplitSeries = action.value
        return
      case 'defaultmodeupdate':
        draft.defaultedsearch = action.value
        return
      case 'queryupdate':
        draft.query = action.value
        return
    }
  }
  function joinWrap(arr, prefix, suffix) {
    return prefix + arr.join(suffix + prefix) + suffix
  }
  function rangeHandler(results) {
    const rangeStart = resultsPerPage * currentPage
    const rangeEnd = rangeStart + resultsPerPage
    return [...results.slice(rangeStart, rangeEnd)]
  }
  function entityEncode(str) {
    return Entities.encodeNonUTF(str)
  }
  const hasQuery = state.query && state.query.length
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <div className="App">
          {/* <pre>{JSON.stringify(state).replaceAll('{', '').replaceAll('}', '').replaceAll(',', ',\n')}</pre> */}
          <h1 className="App-header">GlyphWorks</h1>
          <SearchInput isSplitSeries={state.isSplitSeries} onInputChange={setCurrentPage} />
          <SearchMode isSplitSeries={state.isSplitSeries} query={state.query} />
          <button aria-expanded={uiStorage.glyphs} aria-controls="section-glyphs" className={`section-title${hasQuery ? ' active' : ''}${hasQuery && uiStorage.glyphs ? ' expanded' : ''}`} onClick={() => setUiStorage({ ...uiStorage, glyphs: !uiStorage.glyphs })} disabled={hasQuery ? null : true}>
            Glyphs
          </button>
          <AnimateHeight id="section-glyphs" duration={500} height={uiStorage.glyphs ? 'auto' : 0}>
            <ul className="glyphcardContainer">{hasQuery ? rangeHandler(state.results).map((item, index) => <GlyphCard item={unicodeData[item]} key={index} />) : null}</ul>
            {hasQuery && state.results.length > resultsPerPage ? <Paginators currentPage={currentPage} decrement={() => setCurrentPage(Math.max(0, currentPage - 1))} increment={() => setCurrentPage(Math.floor(Math.min(state.results.length / resultsPerPage, currentPage + 1)))} numPages={Math.floor((state.results.length - 1) / resultsPerPage)} /> : false}
          </AnimateHeight>
          <button aria-expanded={uiStorage.htmlEntities} aria-controls="section-glyphs" className={`section-title${hasQuery && uiStorage.htmlEntities ? ' expanded' : ''}`} onClick={() => setUiStorage({ ...uiStorage, htmlEntities: !uiStorage.htmlEntities })} disabled={hasQuery ? null : true}>
            HTML Entities
          </button>
          <AnimateHeight id="section-entities" duration={500} height={uiStorage.htmlEntities ? 'auto' : 0}>
            {hasQuery ? (
              <>
                <label for="entity-url">URL addresses/mailto: links</label>
                <textarea id="entity-url" value={encodeURI(state.query)}></textarea>
                <label for="entity-all">URL addresses/mailto: links</label>
                <textarea id="entity-all" value={Entities.encode(state.query)}></textarea>
                {/* <textarea value={Entities.encodeNonUTF(state.query)}></textarea> */}
                {/* <textarea value={Entities.encodeNonASCII(state.query)}></textarea> */}
              </>
            ) : null}
          </AnimateHeight>
        </div>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export default App
