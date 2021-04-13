import React, { useState, useContext } from 'react'
import styles from './entitypanel.module.css'
import DispatchContext from '../../DispatchContext'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Dropdown from 'react-dropdown'

const Entities = require('html-entities').AllHtmlEntities

function EntityPanel({ query, entityType, entityHandler }) {
  const appDispatch = useContext(DispatchContext)
  const options = [
    { value: 'htmlentities', label: 'HTML Entities' },
    { value: 'urlescape', label: 'URL Escape Codes' }
  ]

  let defaultOption = options[options.findIndex(p => p.value === entityType)]
  const selectHandler = ({ value }) => entityHandler(value)

  const copyFlashHandler = msg => appDispatch({ type: 'flashMessage', value: `${msg} copied` })

  function RenderEntityFields({ query, type }) {
    let entitystring = ''
    let copymessage = ''
    switch (type) {
      case 'urlescape':
        entitystring = encodeURI(query)
        copymessage = 'URL escape codes'
        defaultOption = options[1]
        break
      default:
        entitystring = Entities.encode(query)
        copymessage = 'HTML entities'
        defaultOption = options[0]
    }
    return (
      <>
        <CopyToClipboard onCopy={() => copyFlashHandler(copymessage)} text={entitystring}>
          {/* <div className={styles.field}>{entitystring.split('%').forEach(i => `span${i}span`)}</div> */}
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
        <>
          <p className={styles.nothing}>No current results.</p>
        </>
      )}
    </div>
  )
}

export default EntityPanel
