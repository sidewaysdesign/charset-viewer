import React, { useContext } from 'react'
import DispatchContext from '../../DispatchContext'
import styles from './glyphcardcontrols.module.css'

function GlyphCardControls({ toggle, toggleHandler }) {
  const appDispatch = useContext(DispatchContext)
  const closeHandler = () => {
    appDispatch({ type: 'closeinspector', inspectoropen: false })
  }
  return (
    <div className={styles.container}>
      <div className="panelTitle">Glyphs</div>
      <button
        className={`${styles.toggle} ${toggle === 'shownames' || toggle === true ? 'active' : ''}`}
        onClick={() => {
          return toggleHandler(toggle)
        }}>
        Show names<span></span>
      </button>
      <button className="inspectorBackButton" onClick={() => closeHandler()}>
        Back to results
      </button>
    </div>
  )
}

export default GlyphCardControls
