import React, { useContext } from 'react'
import DispatchContext from '../../DispatchContext'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { isBlankChar } from '../../logic/IsBlankChar'
import { unicodeData } from '../../unicode/UnicodeData'
import { flagDescriptor } from '../../logic/MultiCodePoints'
import { hyphenTitleCase, lowercaseConjunctions } from '../../logic/CaseHandlers'
import styles from './glyphcard.module.css'

function GlyphCard({ item, inspectoropen }) {
  const singleUnicode = typeof item === 'number'
  const [glyph, charname] = singleUnicode ? unicodeData[item].split(';') : flagDescriptor(item)
  const characterString = []
    .concat(glyph || [])
    .map(i => String.fromCodePoint(parseInt(i, 16)))
    .join('')
  const processedName = singleUnicode ? lowercaseConjunctions(hyphenTitleCase(charname)) : charname
  const appDispatch = useContext(DispatchContext)
  const openInspectorHandler = () => {
    if (!inspectoropen) {
      appDispatch({ type: 'openinspector', inspectoropen: true, data: { item, glyph, processedName, characterString } })
    }
  }
  return (
    <li className={styles.unit} onClick={() => openInspectorHandler()}>
      <h3 className={`${styles.bigglyph}${(charname.toLowerCase().includes('space') || charname.toLowerCase().includes('invisible')) && isBlankChar(characterString) ? ` ${styles.sideborder}` : ''}`}>
        <span>{characterString}</span>
      </h3>
      <div className={styles.info}>
        <div className={styles.name}>
          <p>{processedName}</p>
        </div>
      </div>
    </li>
  )
}
export default GlyphCard
