import React, { useState, useContext } from 'react'
import styles from './entitypanel.module.css'
import DispatchContext from '../../DispatchContext'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Dropdown from 'react-dropdown'

const Entities = require('html-entities').AllHtmlEntities

function EntityPanel({ query, entityType, entityHandler }) {
  const appDispatch = useContext(DispatchContext)
  const options = [
    { value: 'urlescape', label: 'URL Escape Codes' },
    { value: 'htmlentities', label: 'HTML Entities' }
  ]
  const defaultOption = options[0]
  const selectHandler = ({ value }) => {
    entityHandler(value)
  }
  const copyFlashHandler = msg => {
    appDispatch({ type: 'flashMessage', value: `${msg} copied` })
  }
  function RenderEntityFields({ query, type }) {
    let entitystring = ''
    let copymessage = ''
    switch (type) {
      case 'urlescape':
        entitystring = encodeURI(query)
        copymessage = 'URL escape codes'
        break
      case 'htmlentities':
        entitystring = encodeURI(Entities.encode(query))
        copymessage = 'HTML entities'
        break
      default:
    }
    return (
      <>
        <CopyToClipboard onCopy={() => copyFlashHandler(copymessage)} text={entitystring}>
          <div className={styles.field}>{entitystring}</div>
        </CopyToClipboard>
        <CopyToClipboard onCopy={() => copyFlashHandler(copymessage)} text={entitystring}>
          <button className="copybutton">COPY</button>
        </CopyToClipboard>
      </>
    )
  }
  return (
    <div className="entityContainer">
      <div className={styles.title}>Entities</div>
      {query.length ? (
        <div className={styles.wrapper}>
          <Dropdown options={options} onChange={selectHandler} value={defaultOption} placeholder="Select an option" />
          <RenderEntityFields query={query} type={entityType} />
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default EntityPanel
