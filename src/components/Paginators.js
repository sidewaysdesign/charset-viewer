import React from 'react'

function Paginators({ increment, decrement, currentPage }) {
  return (
    <>
      <button disabled={!currentPage} onClick={() => decrement()}>
        «
      </button>
      <div className="current_page">{currentPage + 1}</div>
      <button onClick={() => increment()}>»</button>
    </>
  )
}
export default Paginators
