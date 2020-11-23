import React, { useContext, Checkbox } from 'react'
import DispatchContext from '../../DispatchContext'

import styles from './searchmode.module.css'

function SearchMode({ splitseries, query }) {
  const appDispatch = useContext(DispatchContext)
  const isEnabled = query && query.length
  return (
    <div className={styles.SearchMode_Container}>
      {/* {JSON.stringify({ query: query })} */}
      <div className={styles.SearchMode_Checkbox}>
        <input type="checkbox" id="splitseries" disabled={!isEnabled} checked={splitseries} className={styles.SearchMode_Checkbox} onChange={e => appDispatch({ type: 'splitseries', value: e.target.checked })} />
        <label htmlFor="splitseries">Split into series</label>
      </div>
    </div>
  )
}
export default SearchMode
