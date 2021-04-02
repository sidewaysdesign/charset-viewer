import React, { useState, useEffect, useContext } from 'react'
import ourReducer from './logic/OurReducer'
import Paginators from './components/Paginators/Paginators'
import GlyphCard from './components/GlyphCard/GlyphCard'
import Inspector from './components/Inspector/Inspector'
import SearchInput from './components/SearchInput/SearchInput'
import ModeToggle from './components/ModeToggle/ModeToggle'
import GlyphNamesToggle from './components/GlyphCardControls/GlyphCardControls'
import { unicodeData } from './unicode/UnicodeData'
import StateContext from './StateContext'
import DispatchContext from './DispatchContext'

import { useImmerReducer } from 'use-immer'
import './App.css'

const Entities = require('html-entities').AllHtmlEntities
const initialResultsPerPage = 24
const useStateWithLocalStorage = localStorageKey => {
  const [value, setValue] = useState(localStorage.getItem(localStorageKey) || true)
  localStorage.setItem(localStorageKey, value)
  return [value, setValue]
}
function App() {
  const [currentPage, setCurrentPage] = useState(0)
  const [resultsPerPage, setResultsPerPage] = useState(initialResultsPerPage)
  const [glyphsToggle, setGlyphsToggle] = useStateWithLocalStorage('glyphsToggle')
  const [entitiesToggle, setEntitiesToggle] = useStateWithLocalStorage('entitiesToggle')
  const [modeToggle, setModeToggle] = useStateWithLocalStorage('modeToggle')
  const [glyphnameToggle, setGlyphnameToggle] = useStateWithLocalStorage('glyphnameToggle')
  const appDispatch = useContext(DispatchContext)

  const originalState = {
    query: '',
    isSplitSeries: true,
    results: [],
    inspectorOpen: false,
    inspectorIndex: null
  }
  const modeHandler = state => setModeToggle(state)
  const toggleHandler = state => setGlyphnameToggle(!glyphnameToggle)

  const [uiStorage, setUiStorage] = useState(
    JSON.parse(localStorage.getItem('uiStorage')) || {
      glyphs: true,
      htmlEntities: false
    }
  )

  useEffect(() => {
    localStorage.setItem('uiStorage', JSON.stringify(uiStorage))
  }, [uiStorage])

  const [state, dispatch] = useImmerReducer(ourReducer, originalState)
  function rangeHandler(results) {
    const rangeStart = resultsPerPage * currentPage
    const rangeEnd = rangeStart + resultsPerPage
    return [...results.slice(rangeStart, rangeEnd)]
  }
  const hasQuery = state.query && state.query.length
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <div className="App">
          <header>
            <h1>GlyphWorks</h1>
            <div className="inputContainer">
              <SearchInput isSplitSeries={state.isSplitSeries} placeholder="Input chracters or search names" onInputChange={setCurrentPage} />
            </div>
          </header>
          <ModeToggle mode={modeToggle} modeHandler={modeHandler} />
          <div className={`outputContainer${modeToggle === 'entities' ? ' showentities' : ''}`}>
            <div className="glyphcardContainer">
              <div className={`glyphcardWrapper${state.inspectorOpen ? ' inspectoropen' : ''}`}>
                <GlyphNamesToggle toggle={glyphnameToggle} toggleHandler={toggleHandler} />
                <div className="glyphPanelContainer">
                  <div className="glyphPanelUnit">
                    <ul className={`glyphcardList${glyphnameToggle ? ' shownames' : ''}`}>{hasQuery ? rangeHandler(state.results).map((item, index) => <GlyphCard item={unicodeData[item]} key={index} inspectoropen={state.inspectorOpen} />) : null}</ul>
                  </div>
                  <div className="glyphPanelUnit">{state.inspectorOpen && state.inspectorIndex ? <Inspector index={state.inspectorIndex} /> : ''}</div>
                </div>
              </div>
            </div>
            {/* {hasQuery && state.results.length > resultsPerPage ? <Paginators currentPage={currentPage} decrement={() => setCurrentPage(Math.max(0, currentPage - 1))} increment={() => setCurrentPage(Math.floor(Math.min(state.results.length / resultsPerPage, currentPage + 1)))} numPages={Math.floor((state.results.length - 1) / resultsPerPage)} /> : false} */}
            <div className="entityContainer">
              <label htmlFor="entity-url">URL addresses/mailto: links</label>
              <textarea readOnly id="entity-url" value={encodeURI(state.query)}></textarea>
              <label htmlFor="entity-all">URL addresses/mailto: links</label>
              <textarea readOnly id="entity-all" value={Entities.encode(state.query)}></textarea>
            </div>
          </div>
          <footer>
            <span>[inf]</span>
            <span>{`©${new Date().getFullYear()} Sideways Design`}</span>
          </footer>
        </div>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export default App
