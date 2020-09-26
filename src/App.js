import React, { useState, useEffect, useReducer } from 'react'
import raw from 'raw.macro'
import Paginators from './components/Paginators'

import './App.css'
const uniCodePos = 0
const uniNamePos = 1
const unicodeData = raw('./unicode/UnicodeData.txt')
  .replace(/^\s+|\s+$/g, '')
  .split('\n')
const unicodeNames = unicodeData.map(a => a.split(';')[uniNamePos])
const unicodeNumbers = unicodeData.map(a => a.split(';')[uniCodePos])
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
  const [resultsPerPage, setResultsPerPage] = useState(4)
  const [{ hits, hasError, isLoading }, dispatch] = useReducer(fetchReducer, {
    hits: [],
    isLoading: true,
    hasError: false
  })
  const [query, setQuery] = useState('RHO')

  async function fetchHits(query, dispatch) {
    dispatch({ type: 'FETCH_START' })
    try {
      const result = searchHandler(query)
      dispatch({ type: 'FETCH_SUCCESS', payload: result })
    } catch (err) {
      dispatch({ type: 'FETCH_FAILURE' })
    }
  }

  function searchHandler(query) {
    if (query.length === 0) {
      return []
    }
    if (query.length === 1) {
      return [unicodeNumbers.findIndex(el => el === query.charCodeAt(0).toString(16).padStart(4, '0'))]
    }
    const results = unicodeNames.map((el, index) => (el.includes('RHO') ? index : false)).filter(el => el)
    console.log(results.length, results)
    return results
  }
  function rangeHandler(results) {
    const rangeStart = resultsPerPage * currentPage
    const rangeEnd = rangeStart + resultsPerPage
    return results.slice(rangeStart, rangeEnd)
  }
  useEffect(() => {
    const timeOutId = setTimeout(() => fetchHits(query, dispatch), 250)
    setCurrentPage(0)
    return () => clearTimeout(timeOutId)
  }, [query])

  return (
    <div className="App">
      <>
        <input type="text" value={query} onChange={event => setQuery(event.target.value)} />
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
            <ul>
              {rangeHandler(hits).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            {query.length > 1 || hits.length > 1 ? <Paginators decrement={() => setCurrentPage(Math.max(0, currentPage - 1))} increment={() => setCurrentPage(Math.floor(Math.min(hits.length / resultsPerPage), currentPage + 1))} currentPage={currentPage} /> : ''}
          </>
        )}
      </>
    </div>
  )
}

export default App
