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

  function isBlankChar(chr) {
    var mycanvas = document.createElement('canvas')
    mycanvas.width = 8
    mycanvas.height = 8
    document.body.appendChild(mycanvas)
    var ctx = mycanvas.getContext('2d')
    ctx.font = "4px monospace, 'segoe ui symbol', 'segoe ui symbol', source-code-pro"
    ctx.fillText(chr, 0, 6)
    let imgData = ctx.getImageData(0, 0, 8, 8)
    let isBlank = true
    for (let i = 0; i < imgData.data.length; i += 4) {
      if (imgData.data[i + 3]) {
        isBlank = false
        break
      }
    }
    document.body.removeChild(mycanvas)
    return isBlank
  }

  const copyClipHandler = () => {
    if (!copiedEntity.copied) {
      setCopiedEntity({ copied: true })
      setTimeout(() => setCopiedEntity({ copied: false }), 1250)
    }
  }
  console.log(characterString == '')
  return (
    <div className={styles.glyphcard_unit}>
      <CopyToClipboard className={`${styles.glyphcard_bigletter}${copiedEntity.copied ? ' copied' : ''}${charname.toLowerCase().includes('space') && isBlankChar(characterString) ? ` ${styles.sideborder}` : ''}`} text={characterString} onCopy={() => copyClipHandler()}>
        <h3>
          <span>{characterString}</span>
        </h3>
      </CopyToClipboard>
      <div className={`${styles.glyphcard_info}`}>
        <CopyToClipboard className={`${styles.glyphcard_name}${copiedEntity.copied ? ' copied' : ''}`} text={hyphenTitleCaseVal} onCopy={() => copyClipHandler()}>
          <p>{hyphenTitleCaseVal}</p>
        </CopyToClipboard>
        <CopyToClipboard className={`${styles.glyphcard_entity}${copiedEntity.copied ? ' copied' : ''}`} text={`&${unicodenum};`} onCopy={() => copyClipHandler()}>
          <p>{`&#x${unicodenum};`}</p>
        </CopyToClipboard>
        {copiedEntity.copied ? <div className={`${styles.glyphcard_copied} copiedactive`}>Copied</div> : null}
      </div>
    </div>
  )
}
export default GlyphCard
