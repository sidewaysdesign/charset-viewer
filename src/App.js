import React, { useState } from 'react'
// import { useDebounce } from 'use-debounce'
import Paginators from './components/Paginators/Paginators'
import GlyphCard from './components/GlyphCard/GlyphCard'
import SearchInput from './components/SearchInput/SearchInput'
import SearchMode from './components/SearchMode/SearchMode'
import { unicodeData } from './unicode/UnicodeData'
import StateContext from './StateContext'
import DispatchContext from './DispatchContext'
import { useImmerReducer } from 'use-immer'

import './App.css'

const initialResultsPerPage = 24

function App() {
  const [currentPage, setCurrentPage] = useState(0)
  const [resultsPerPage, setResultsPerPage] = useState(initialResultsPerPage)
  // const [results, setResults] = useState([])
  const originalState = {
    query: 'tears',
    isSplitSeries: true,
    results: []
  }
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

  function rangeHandler(results) {
    const rangeStart = resultsPerPage * currentPage
    const rangeEnd = rangeStart + resultsPerPage
    return [...results.slice(rangeStart, rangeEnd)]
  }
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <div className="App">
          {/* <pre>{JSON.stringify(state).replaceAll('{', '').replaceAll('}', '').replaceAll(',', ',\n')}</pre> */}
          <h1 className="App-header">Glyph-O-Rama</h1>
          <SearchInput isSplitSeries={state.isSplitSeries} />
          <SearchMode isSplitSeries={state.isSplitSeries} query={state.query} />
          <div className="">
            0{/* {JSON.stringify({ query: state.query, results: state.results })} */}
            <h5>Glyphs</h5>
            {/* <h5>{state.results.length}</h5> */}
            <ul className="glyphcard_container">{state.results && state.results.length ? rangeHandler(state.results).map((item, index) => <GlyphCard item={unicodeData[item]} key={index} />) : <p>No results</p>}</ul>
            <h1>{currentPage}</h1>
            {state.results && state.results.length > resultsPerPage ? <Paginators currentPage={currentPage} decrement={() => setCurrentPage(Math.max(0, currentPage - 1))} increment={() => setCurrentPage(Math.floor(Math.min(state.results.length / resultsPerPage, currentPage + 1)))} numPages={Math.floor((state.results.length - 1) / resultsPerPage)} /> : false}
          </div>
          <textarea></textarea>
        </div>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export default App
