import React, { useContext, useState, useEffect } from 'react'
import DispatchContext from '../../DispatchContext'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import styles from './inspector.module.css'
import { isBlankChar } from '../../logic/IsBlankChar'
import { OversizeCharCompensator } from '../../logic/OversizeCharCompensator'
import { hyphenTitleCase } from '../../logic/CaseHandlers'

function Inspector({ inspectoropen, data }) {
  const [copiedEntity, setCopiedEntity] = useState({ value: '', copied: false })
  const isSeq = data.item.length > 1
  const appDispatch = useContext(DispatchContext)

  const urlEscape = `%${[]
    .concat(data.glyph || [])
    .map(i => `${encodeURIComponent(i)}`)
    .join('%')}`
  const utf8 = urlEscape.split('%').join('0x').trim()
  const htmlEntity = `&#${[]
    .concat(data.glyph || [])
    .map(i => parseInt(i, 16))
    .join(';&#')};`
  const htmlEntityHex = `&#x${[].concat(data.glyph || []).join(';&#x')};`
  const cssEncode = `\\${[].concat(data.glyph || []).join('\\')}`

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
            className={`pseudocopybutton ${styles.inspector_bigglyph}
      ${isBlankChar(data.characterString) ? ` sideborder` : ''}`}
            text={data.characterString}>
            <h3>
              <span style={{ fontSize: `${OversizeCharCompensator(data.characterString)}em` }}>{data.characterString}</span>
            </h3>
          </CopyToClipboard>
          <CopyToClipboard className={`pseudocopybutton ${styles.inspector_name}`} onCopy={() => copyFlashHandler('Glyph name')} text={data.processedName}>
            <p>
              <span>{data.processedName.replace(/( )([\w]{1,4})$/, '\u00a0$2')}</span>
            </p>
          </CopyToClipboard>
        </div>
        <div className={styles.inspector_column}>
          <div className={`${styles.inspector_info}`}>
            <CopyToClipboard data-type={`HTML Entity${isSeq ? ' sequence' : ''}`} onCopy={() => copyFlashHandler(`HTML entity${isSeq ? ' sequence' : ''}`)} className={`pseudocopybutton ${styles.inspector_entity}`} text={htmlEntity}>
              <p>{htmlEntity}</p>
            </CopyToClipboard>
            <CopyToClipboard data-type={`HTML Entity${isSeq ? ' Sequence' : ''} (Hex)`} onCopy={() => copyFlashHandler(`HTML entity${isSeq ? ' sequence' : ''} (hex)`)} className={`pseudocopybutton ${styles.inspector_entity}`} text={htmlEntityHex}>
              <p>{htmlEntityHex}</p>
            </CopyToClipboard>
            <CopyToClipboard data-type="CSS Encoding" onCopy={() => copyFlashHandler('CSS encoding')} className={`pseudocopybutton ${styles.inspector_entity}`} text={cssEncode}>
              <p>{cssEncode}</p>
            </CopyToClipboard>
            <CopyToClipboard data-type={`URL Escape Code${urlEscape.split('%').length <= 2 ? '' : isSeq ? ' sequence' : 's'}`} onCopy={() => copyFlashHandler('URL escape code')} className={`pseudocopybutton ${styles.inspector_entity}`} text={urlEscape}>
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
