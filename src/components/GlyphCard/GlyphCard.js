import React, { useState, useContext } from 'react'
import DispatchContext from '../../DispatchContext'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { isBlankChar } from '../../logic/IsBlankChar'
import { hyphenTitleCase, lowercaseConjunctions } from '../../logic/CaseHandlers'
import styles from './glyphcard.module.css'

function GlyphCard({ item, inspectoropen }) {
  const [copiedEntity, setCopiedEntity] = useState({ value: '', copied: false })
  const [unicodenum, charname] = item.split(';')
  const characterString = String.fromCodePoint(parseInt(unicodenum, 16))
  const hyphenTitleCaseVal = hyphenTitleCase(charname)
  const processedName = lowercaseConjunctions(hyphenTitleCaseVal)
  const appDispatch = useContext(DispatchContext)
  const copyClipHandler = () => {
    if (!copiedEntity.copied) {
      setCopiedEntity({ copied: true })
      setTimeout(() => setCopiedEntity({ copied: false }), 1250)
    }
  }
  const openInspectorHandler = (glyph, inspectoropen) => {
    if (!inspectoropen) {
      console.log('opening')
      appDispatch({ type: 'openinspector', inspectoropen: true, index: item })
    }
  }
  return (
    <li className={styles.unit} onClick={() => openInspectorHandler(item, inspectoropen)}>
      <CopyToClipboard
        className={`${styles.bigletter}${copiedEntity.copied ? ' copied' : ''}
      ${(charname.toLowerCase().includes('space') || charname.toLowerCase().includes('invisible')) && isBlankChar(characterString) ? ` ${styles.sideborder}` : ''}`}
        text={characterString}>
        <h3>
          <span>{characterString}</span>
        </h3>
      </CopyToClipboard>
      <div className={`${styles.info}`}>
        <div className={`${styles.name}${copiedEntity.copied ? ' copied' : ''}`} text={processedName} onCopy={() => copyClipHandler()}>
          <p>{processedName}</p>
        </div>
        {copiedEntity.copied ? <div className={`${styles.copied} copiedactive`}>Copied</div> : null}
      </div>
    </li>
  )
}
export default GlyphCard
