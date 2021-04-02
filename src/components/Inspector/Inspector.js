import React, { useContext, useState, useEffect } from 'react'
import DispatchContext from '../../DispatchContext'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import styles from './inspector.module.css'
import { isBlankChar } from '../../logic/IsBlankChar'
import { OversizeCharCompensator } from '../../logic/OversizeCharCompensator'
import { hyphenTitleCase } from '../../logic/CaseHandlers'

const copyClipHandler = () => {}
function Inspector({ index }) {
  const [copiedEntity, setCopiedEntity] = useState({ value: '', copied: false })
  const [unicodenum, charname] = index.split(';')
  const characterString = String.fromCodePoint(parseInt(unicodenum, 16))
  const hyphenTitleCaseVal = hyphenTitleCase(charname)
  const appDispatch = useContext(DispatchContext)
  const closeHandler = () => {
    appDispatch({ type: 'closeinspector', inspectoropen: false })
  }
  const escapeListenerCheck = e => {
    if (e.key === 'Escape') {
      window.removeEventListener('keydown', escapeListenerCheck)
      closeHandler()
    }
  }
  useEffect(() => {
    window.addEventListener('keydown', escapeListenerCheck)
  }, [])

  return (
    // <div className="glyphInspector" onKeyDown={e => escapeKeyHandler(e)} tabIndex="0">
    <div className="glyphInspector">
      <button className={styles.inspector_closebutton} onClick={() => closeHandler()}>
        {''}
      </button>
      <div className={styles.inspector_unit}>
        <div className={styles.inspector_column}>
          <CopyToClipboard
            className={`${styles.inspector_bigletter}${copiedEntity.copied ? ' copied' : ''}
      ${(charname.toLowerCase().includes('space') || charname.toLowerCase().includes('invisible')) && isBlankChar(characterString) ? ` ${styles.sideborder}` : ''}`}
            text={characterString}>
            <h3>
              <span style={{ fontSize: `${OversizeCharCompensator(characterString)}em` }}>{characterString}</span>
            </h3>
          </CopyToClipboard>
          <CopyToClipboard className={`${styles.inspector_name}${copiedEntity.copied ? ' copied' : ''}`} text={hyphenTitleCaseVal} onCopy={() => copyClipHandler()}>
            <p>{hyphenTitleCaseVal}</p>
          </CopyToClipboard>
        </div>{' '}
        <div className={styles.inspector_column}>
          <div className={`${styles.inspector_info}`}>
            <CopyToClipboard className={`${styles.inspector_entity}${copiedEntity.copied ? ' copied' : ''}`} text={`&${unicodenum};`} onCopy={() => copyClipHandler()}>
              <p>{`&#x${unicodenum};`}</p>
            </CopyToClipboard>
            {copiedEntity.copied ? <div className={`${styles.inspector_copied} copiedactive`}>Copied</div> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Inspector
