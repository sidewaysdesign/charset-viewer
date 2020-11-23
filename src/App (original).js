import React, { useState, useEffect, useReducer } from 'react'
import logo from './logo.svg'
import raw from 'raw.macro'
import Incrementors from './components/Incrementors'

import './App.css'

const unicode = raw('./unicode/UnicodeData.txt').split('\n')

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
  const [searchTerm, splitseriesTerm] = useState('')
  const [searchResults, splitseriesResults] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(4)
  const [{ hits, hasError, isLoading }, dispatch] = useReducer(fetchReducer, {
    hits: unicode,
    isLoading: true,
    hasError: false
  })
  const [query, setQuery] = useState('')
  const [rangedResults, setRangedResults] = useState([])

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
    const results = unicode.filter(uni => uni.includes(query.toUpperCase()))
    return results
  }
  function rangeHandler(results) {
    const rangeStart = resultsPerPage * currentPage
    const rangeEnd = rangeStart + resultsPerPage
    return results.slice(rangeStart, rangeStart + resultsPerPage)
  }
  // function filterResultsRange(results) {
  //   const rangeStart = resultsPerPage * currentPage
  //   return results.slice(rangeStart, rangeStart + resultsPerPage)
  // }
  useEffect(() => {
    const timeOutId = setTimeout(() => fetchHits(query, dispatch), 500)
    setCurrentPage(0)
    return () => clearTimeout(timeOutId)
  }, [query])

  function updateCurrentPage() {}
  return (
    <div className="App">
      <>
        <input type="text" value={query} onChange={event => setQuery(event.target.value)} />
        {hasError && <div>Search error...</div>}
        {isLoading ? (
          <div>Loading...</div>
        ) : query.length == 0 ? (
          <div className="no_results">Enter search term</div>
        ) : !hits.length ? (
          <>
            <p>{hits.length}</p>
            <div className="no_results">No results</div>
          </>
        ) : (
          <>
            <ul>
              {rangeHandler(hits).map(item => (
                <li key={item.objectID}>{item}</li>
              ))}
            </ul>
            <Incrementors increment={() => setCurrentPage(currentPage + 1)} decrement={() => setCurrentPage(currentPage - 1)} currentPage={currentPage} />
          </>
        )}
      </>
    </div>
  )
}

export default App
