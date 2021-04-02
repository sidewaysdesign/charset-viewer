import React, { useContext } from 'react'
import styles from './glyphcardcontrols.module.css'

function GlyphCardControls({ toggle, toggleHandler }) {
  return (
    <div className={styles.container}>
      <button className={`${styles.toggle} ${toggle ? styles.active : ''}`} onClick={() => toggleHandler()}>
        Show names<span className={toggle ? styles.active : ''}></span>
      </button>
    </div>
  )
}

export default GlyphCardControls
