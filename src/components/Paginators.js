import React from 'react'

function Paginators({ increment, decrement, currentPage }) {
  return (
    <>
      <button onClick={() => decrement()}>«</button>
      <div className="current_page">{currentPage}</div>
      <button onClick={() => increment()}>»</button>
    </>
  )
}
export default Paginators
