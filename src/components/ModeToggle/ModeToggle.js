import React, { useContext } from 'react'
import styles from './modetoggle.module.css'
import DispatchContext from '../../DispatchContext'

function ModeToggle({ mode, modeHandler }) {
  const appDispatch = useContext(DispatchContext)
  const closeInspectorHandler = () => {
    appDispatch({ type: 'closeinspector', inspectoropen: false })
  }
  return (
    <div className={styles.mobileModeContainer}>
      <ul>
        <li className={mode === 'glyphs' ? styles.active : ''} onClick={() => modeHandler('glyphs')}>
          Glyphs
        </li>
        <li
          className={mode === 'entities' ? styles.active : ''}
          onClick={() => {
            modeHandler('entities')
            closeInspectorHandler()
          }}>
          Entities
        </li>
      </ul>
    </div>
  )
}

export default ModeToggle
