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
import EntityPanel from './components/EntityPanel/EntityPanel'
import FlashAlerts from './components/FlashAlerts/FlashAlerts'
import Footer from './components/Footer/Footer'

// import { useParams } from 'react-router'

import { useImmerReducer } from 'use-immer'
import './App.css'

const Entities = require('html-entities').AllHtmlEntities
const initialResultsPerPage = 200
const useStateWithLocalStorage = (localStorageKey, defaultValue) => {
  // console.log('localStorage.getItem(localStorageKey) ', localStorageKey, localStorage.getItem(localStorageKey))
  const [value, setValue] = useState(localStorage.getItem(localStorageKey) || defaultValue)
  localStorage.setItem(localStorageKey, value)
  return [value, setValue]
}
function App() {
  const [currentPage, setCurrentPage] = useState(0)
  const [resultsPerPage, setResultsPerPage] = useState(initialResultsPerPage)
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
  const entityHandler = xstate => {
    console.log('x', state.entityType)
    setEntityType(xstate)
  }
  const [uiStorage, setUiStorage] = useState(
    JSON.parse(localStorage.getItem('uiStorage')) || {
      glyphs: true,
      htmlEntities: false
    }
  )

  useEffect(() => {
    localStorage.setItem('uiStorage', JSON.stringify(uiStorage))
  }, [uiStorage])
  const validResults = item => {
    // return false
    return item !== undefined && item.length
  }
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
              <SearchInput placeholder="Input chracters or search names" onInputChange={setCurrentPage} />
            </div>
          </header>
          <ModeToggle mode={modeToggle} modeHandler={modeHandler} />
          <div className={`outputContainer${modeToggle === 'entities' ? ' showentities' : ''}`}>
            <div className="glyphcardContainer">
              <div className={`glyphcardWrapper${state.inspectorOpen ? ' inspectoropen' : ''}`}>
                <GlyphNamesToggle toggle={glyphnameToggle} toggleHandler={toggleHandler} />
                <div className="glyphPanelContainer">
                  <div className="glyphPanelUnit">
                    <ul className={`glyphcardList${glyphnameToggle ? ' shownames' : ''}`}>{hasQuery && validResults(state.results) ? rangeHandler(state.results).map((item, index) => <GlyphCard item={unicodeData[item]} key={index} inspectoropen={state.inspectorOpen} />) : null}</ul>
                  </div>
                  <div className="glyphPanelUnit">{state.inspectorOpen && state.inspectorIndex ? <Inspector index={state.inspectorIndex} /> : ''}</div>
                </div>
              </div>
            </div>
            <EntityPanel query={state.query} entityType={entityType} entityHandler={entityHandler} />
          </div>
          <Footer />
          <FlashAlerts messages={state.flashMessages} />
        </div>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export default App
