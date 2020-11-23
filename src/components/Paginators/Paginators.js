import React from 'react'
import styles from './paginators.module.css'

function Paginators({ increment, decrement, currentPage, numPages }) {
  return (
    <div className={styles.Paginators}>
      <button className={styles.increment} disabled={currentPage ? null : true} onClick={() => decrement()}></button>
      <p>
        <span>{currentPage + 1}</span> of <span>{numPages + 1}</span>
      </p>
      <button disabled={currentPage < numPages ? null : true} className={styles.decrement} onClick={() => increment()}></button>
    </div>
  )
}
export default Paginators
