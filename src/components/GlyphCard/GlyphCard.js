import React, { useContext } from 'react'
import DispatchContext from '../../DispatchContext'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { derivedAttributes } from '../../logic/DerivedAttributes'
import { unicodeData } from '../../unicode/UnicodeData'
import { flagDescriptor } from '../../logic/MultiCodePoints'
import { hyphenTitleCase, lowercaseConjunctions } from '../../logic/CaseHandlers'
import styles from './glyphcard.module.css'
import { checkUnavailable } from '../../logic/DerivedAttributes'

function GlyphCard({ item, inspectoropen }) {
  const singleUnicode = typeof item === 'number'
  const [glyph, charname, unicat] = singleUnicode ? unicodeData[item].split(';') : flagDescriptor(item)
  const characterString = []
    .concat(glyph || [])
    .map(i => String.fromCodePoint(parseInt(i, 16)))
    .join('')
  const processedName = singleUnicode ? lowercaseConjunctions(hyphenTitleCase(charname)) : charname
  const appDispatch = useContext(DispatchContext)
  const isunavailable = checkUnavailable(characterString)
  const openInspectorHandler = () => {
    if (!inspectoropen) {
      console.log('characterString', characterString)
      appDispatch({ type: 'openinspector', inspectoropen: true, data: { item, glyph, processedName, characterString, unicat, isunavailable } })
    }
  }
  return (
    <li className={styles.unit} onClick={() => openInspectorHandler()}>
      <h3 className={`${styles.bigglyph}${unicat === 'Zs' ? ` sideborder` : ''}${unicat === 'Mn' || unicat === 'Cf' ? ` zerowidth` : ''}${isunavailable ? ` unavailable` : ''}`}>
        <span>{isunavailable ? '' : characterString}</span>
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
