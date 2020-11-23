import React, { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import styles from './glyphcard.module.css'

function GlyphCard({ item }) {
  const [copiedEntity, setCopiedEntity] = useState({ value: '', copied: false })
  const [unicodenum, charname] = item.split(';')
  const characterString = String.fromCodePoint(parseInt(unicodenum, 16))
  const hyphenTitleCaseVal = hyphenTitleCase(charname)
  function regTitleCase(str) {
    return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
  }
  function hyphenTitleCase(str) {
    return regTitleCase(str)
      .split('-')
      .map(a => regTitleCase(a))
      .join('-')
  }

  const copyClipHandler = () => {
    if (!copiedEntity.copied) {
      setCopiedEntity({ copied: true })
      setTimeout(() => setCopiedEntity({ copied: false }), 1250)
    }
  }
  return (
    <div className={styles.glyphcard_unit}>
      <CopyToClipboard className={`${styles.glyphcard_bigletter}${copiedEntity.copied ? ' copied' : ''}`} text={characterString} onCopy={() => copyClipHandler()}>
        <h3>{characterString}</h3>
      </CopyToClipboard>
      <div className={`${styles.glyphcard_info}`}>
        <CopyToClipboard className={`${styles.glyphcard_name}${copiedEntity.copied ? ' copied' : ''}`} text={hyphenTitleCaseVal} onCopy={() => copyClipHandler()}>
          <p>{hyphenTitleCaseVal}</p>
        </CopyToClipboard>
        <CopyToClipboard className={`${styles.glyphcard_entity}${copiedEntity.copied ? ' copied' : ''}`} text={`&${unicodenum};`} onCopy={() => copyClipHandler()}>
          <p>{`&${unicodenum};`}</p>
        </CopyToClipboard>
        {copiedEntity.copied ? <div className={`${styles.glyphcard_copied} copiedactive`}>Copied</div> : null}
      </div>
    </div>
  )
}
export default GlyphCard
