import React, { useContext, useState, useEffect } from 'react'
import DispatchContext from '../../DispatchContext'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import styles from './inspector.module.css'
import { isBlankChar } from '../../logic/IsBlankChar'
import { OversizeCharCompensator } from '../../logic/OversizeCharCompensator'
import { hyphenTitleCase } from '../../logic/CaseHandlers'

function Inspector({ inspectoropen, data }) {
  const [copiedEntity, setCopiedEntity] = useState({ value: '', copied: false })
  /* const [data.glyph, charname] = index.split(';') */
  // const data.glyph = String.fromCodePoint(parseInt(data.glyph, 16))
  // const hyphenTitleCaseVal = hyphenTitleCase(charname)
  const appDispatch = useContext(DispatchContext)
  const urlEscape = encodeURIComponent(data.glyph)
  const utf8 = urlEscape.split('%').join(' 0x').trim()

  const closeHandler = () => {
    appDispatch({ type: 'closeinspector', inspectoropen: false })
  }
  const copyFlashHandler = msg => {
    appDispatch({ type: 'flashMessage', value: `${msg} copied` })
  }
  const escapeListenerCheck = e => {
    if (e.key === 'Escape') {
      window.removeEventListener('keydown', escapeListenerCheck)
      closeHandler()
    }
  }

  useEffect(() => window.addEventListener('keydown', escapeListenerCheck), [])

  return (
    // <div className="glyphInspector" onKeyDown={e => escapeKeyHandler(e)} tabIndex="0">
    <div className="glyphInspector">
      <button className={styles.inspector_closebutton} onClick={() => closeHandler()}>
        {''}
      </button>
      <div className={styles.inspector_unit}>
        <div className={styles.inspector_column}>
          <CopyToClipboard
            onCopy={() => copyFlashHandler('Glyph')}
            className={`pseudocopybutton ${styles.inspector_bigletter}
      ${(data.processedName.toLowerCase().includes('space') || data.processedName.toLowerCase().includes('invisible')) && isBlankChar(data.glyph) ? ` ${styles.sideborder}` : ''}`}
            text={data.characterString}>
            <h3>
              <span style={{ fontSize: `${OversizeCharCompensator(data.characterString)}em` }}>{data.characterString}</span>
            </h3>
          </CopyToClipboard>
          <CopyToClipboard className={`pseudocopybutton ${styles.inspector_name}`} onCopy={() => copyFlashHandler('Glyph name')} text={data.processedName}>
            <p>{data.processedName}</p>
          </CopyToClipboard>
        </div>

        <div className={styles.inspector_column}>
          <div className={`${styles.inspector_info}`}>
            <CopyToClipboard data-type="HTML Entity" onCopy={() => copyFlashHandler('HTML entity')} className={`pseudocopybutton ${styles.inspector_entity}`} text={`&#${parseInt(data.glyph, 16)};`}>
              <p>{`&#${parseInt(data.glyph, 16)};`}</p>
            </CopyToClipboard>
            <CopyToClipboard data-type="HTML Entity (Hex)" onCopy={() => copyFlashHandler('HTML hex entity')} className={`pseudocopybutton ${styles.inspector_entity}`} text={`&#x${data.glyph};`}>
              <p>{`&#x${data.glyph};`}</p>
            </CopyToClipboard>
            <CopyToClipboard data-type="CSS Encoding" onCopy={() => copyFlashHandler('CSS encoding')} className={`pseudocopybutton ${styles.inspector_entity}`} text={`\\${data.glyph}`}>
              <p>{`\\${data.glyph}`}</p>
            </CopyToClipboard>
            <CopyToClipboard data-type={`URL Escape Code${urlEscape.split('%').length <= 2 ? '' : 's'}`} onCopy={() => copyFlashHandler('URL escape code')} className={`pseudocopybutton ${styles.inspector_entity}`} text={urlEscape}>
              <p>{urlEscape}</p>
            </CopyToClipboard>
            <CopyToClipboard data-type={`UTF-8 Encoding`} onCopy={() => copyFlashHandler('UTF-8 encoding')} className={`pseudocopybutton ${styles.inspector_entity}`} text={utf8}>
              <p>{utf8}</p>
            </CopyToClipboard>
            {/* {copiedEntity.copied ? <div className={`pseudocopybutton ${styles.inspector_copied} copiedactive`}>Copied</div> : null} */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Inspector
