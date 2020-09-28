import React, { useState, useEffect, useReducer } from 'react'
import raw from 'raw.macro'
import Paginators from './components/Paginators/Paginators'
import CharacterCard from './components/CharacterCard/CharacterCard'

import './App.css'

const uniCodePos = 0
const uniNamePos = 1
const unicodeData = raw('./unicode/UnicodeData.txt')
  .replace(/^\s+|\s+$/g, '')
  .split('\n')
const unicodeNames = unicodeData.map(a => a.split(';')[uniNamePos])
const unicodeNumbers = unicodeData.map(a => a.split(';')[uniCodePos])
const initialResultsPerPage = 24
function fetchReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        isLoading: true,
        hasError: false
      }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        hasError: false,
        hits: action.payload
      }
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        hasError: true
      }
    default:
      throw new Error()
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(initialResultsPerPage)
  const [{ hits, hasError, isLoading }, dispatch] = useReducer(fetchReducer, {
    hits: [],
    isLoading: true,
    hasError: false
  })
  const [query, setQuery] = useState('😃')

  function searchHandler(query) {
    const all_emo_test = /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])$/.test(query)
    if (query.length === 0) {
      return []
    }
    if (query.length === 1 && !all_emo_test) {
      return [unicodeNumbers.findIndex(el => el === query.charCodeAt(0).toString(16).padStart(4, '0'))]
    }
    if (query.length > 1 || all_emo_test) {
      const utf8String = Array.from(query)
      utf8String.map(el => {
        return [unicodeNumbers.findIndex(el => el === query.charCodeAt(0).toString(16).padStart(4, '0'))]
      })
    }
    const results = unicodeNames.map((el, index) => (el.includes(query) ? index : false)).filter(el => el)
    return results
  }
  function rangeHandler(results) {
    const rangeStart = resultsPerPage * currentPage
    const rangeEnd = rangeStart + resultsPerPage
    return results.slice(rangeStart, rangeEnd)
  }
  useEffect(() => {
    async function fetchHits(query, dispatch) {
      dispatch({ type: 'FETCH_START' })
      try {
        const result = searchHandler(query)
        dispatch({ type: 'FETCH_SUCCESS', payload: result })
      } catch (err) {
        dispatch({ type: 'FETCH_FAILURE' })
      }
    }
    const timeOutId = setTimeout(() => fetchHits(query, dispatch), 250)
    setCurrentPage(0)
    return () => clearTimeout(timeOutId)
  }, [query])

  return (
    <div className="App">
      <>
        <h1 className="App-header">Character &amp; Emoji Lookup</h1>
        <input className="main_input" type="text" value={query} onChange={event => setQuery(event.target.value)} />
        {query.length > 0 && hasError && <div>Search error...</div>}
        {isLoading ? (
          <div>Loading...</div>
        ) : query.length === 0 ? (
          <div className="no_results">Enter search term</div>
        ) : !hits.length ? (
          <>
            <p>{hits.length}</p>
            <div className="no_results">No results</div>
          </>
        ) : (
          <>
            <ul className="charactercard_container">
              {rangeHandler(hits).map((item, index) => (
                <CharacterCard item={unicodeData[item]} key={index} />
              ))}
            </ul>
            {query.length > 1 || hits.length > 1 ? <Paginators decrement={() => setCurrentPage(Math.max(0, currentPage - 1))} increment={() => setCurrentPage(Math.floor(Math.min(hits.length / resultsPerPage, currentPage + 1)))} currentPage={currentPage} numPages={Math.floor(hits.length / resultsPerPage)} /> : ''}
          </>
        )}
      </>
      <h3>{`Query length ${query.length}`}</h3>
      <textarea></textarea>
    </div>
  )
}

export default App
