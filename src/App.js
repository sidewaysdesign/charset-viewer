import React, { useState, useEffect } from 'react'
import ourReducer from './logic/OurReducer'
import GlyphCard from './components/GlyphCard/GlyphCard'
import Inspector from './components/Inspector/Inspector'
import SearchInput from './components/SearchInput/SearchInput'
import ModeToggle from './components/ModeToggle/ModeToggle'
import GlyphNamesToggle from './components/GlyphCardControls/GlyphCardControls'
import StateContext from './StateContext'
import DispatchContext from './DispatchContext'
import EntityPanel from './components/EntityPanel/EntityPanel'
import FlashAlerts from './components/FlashAlerts/FlashAlerts'
import Footer from './components/Footer/Footer'
import { useImmerReducer } from 'use-immer'

import './App.css'

/* TODO: add scroll within inspector */
/* TODO: prevent re-renders on inspector copy */
/* TODO: add lightweight categories to search (e.g. fruits, sports) */
/* TODO: dismiss inspector by click outside popup */
/* TODO: improve branding/theming */
/* TODO: HTML entities, numbered glyphs results (no %) */
/* TODO: “load more” for long result lists  */
/* TODO: smooth animations for inspector  */
/* TODO: add category filter buttons */
/* TODO: add glyph sequence detection/display to input */
/* TODO: eliminate tiny animated movement of "back to glyphs" at short height */

const initialResultsPerPage = 1000
const useStateWithLocalStorage = (localStorageKey, defaultValue) => {
  const [value, setValue] = useState(localStorage.getItem(localStorageKey) || defaultValue)
  localStorage.setItem(localStorageKey, value)
  return [value, setValue]
}
function App() {
  const [currentPage, setCurrentPage] = useState(0)
  const resultsPerPage = initialResultsPerPage
  const [modeToggle, setModeToggle] = useStateWithLocalStorage('modeToggle', 'entities')
  const [glyphnameToggle, setGlyphnameToggle] = useStateWithLocalStorage('glyphnameToggle', 'shownames')
  const [entityType, setEntityType] = useStateWithLocalStorage('entityType', 'urlescape')
  const originalState = {
    query: '',
    results: [],
    flashMessages: [],
    inspectorOpen: false,
    inspectorIndex: null
  }
  const modeHandler = state => setModeToggle(state)
  const toggleHandler = state => {
    setGlyphnameToggle(state === 'shownames' ? 'hidenames' : 'shownames')
  }
  const entityHandler = state => setEntityType(state)
  const [uiStorage, setUiStorage] = useState(
    JSON.parse(localStorage.getItem('uiStorage')) || {
      glyphs: true,
      htmlEntities: false
    }
  )

  useEffect(() => {
    localStorage.setItem('uiStorage', JSON.stringify(uiStorage))
  }, [uiStorage])
  const validResults = item => item !== undefined && item.length
  const [state, dispatch] = useImmerReducer(ourReducer, originalState)
  function rangeHandler(results) {
    const rangeStart = resultsPerPage * currentPage
    const rangeEnd = rangeStart + resultsPerPage
    return [...results.slice(rangeStart, rangeEnd)]
  }
  const hasQuery = state.query && state.query.length
  return (
    <>
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <div className="App">
            <header>
              <h1>GlyphWorks</h1>
              <div className="inputContainer">
                <SearchInput onInputChange={setCurrentPage} />
              </div>
            </header>
            <ModeToggle mode={modeToggle} modeHandler={modeHandler} />
            <div className={`outputContainer${modeToggle === 'entities' ? ' showentities' : ''}`}>
              <div className="glyphcardContainer">
                <div className={`glyphcardWrapper${state.inspectorOpen ? ' inspectoropen' : ''}`}>
                  <GlyphNamesToggle count={state.results ? state.results.length : 0} toggle={glyphnameToggle} toggleHandler={toggleHandler} />
                  <div className="glyphPanelContainer">
                    <div className="glyphPanelUnit">
                      <ul className={`glyphcardList${glyphnameToggle === 'shownames' ? ' shownames' : ''}`}>{hasQuery && validResults(state.results) ? rangeHandler(state.results).map((item, index) => <GlyphCard item={item} key={index} inspectoropen={state.inspectorOpen} />) : null}</ul>
                    </div>
                    <div className="glyphPanelUnit">{state.inspectorOpen && state.inspectorData ? <Inspector data={state.inspectorData} /> : ''}</div>
                  </div>
                </div>
              </div>
              <EntityPanel query={state.query} entityType={entityType} entityHandler={entityHandler} />
            </div>
            <Footer />
          </div>
        </DispatchContext.Provider>
        <FlashAlerts messages={state.flashMessages} />
      </StateContext.Provider>
    </>
  )
}

export default App
