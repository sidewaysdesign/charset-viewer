import React, { useContext, useEffect } from 'react'
import DispatchContext from '../../DispatchContext'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import styles from './inspector.module.css'
import { OversizeCharCompensator } from '../../logic/OversizeCharCompensator'
// import { hyphenTitleCase } from '../../logic/CaseHandlers'

function Inspector({ inspectoropen, data }) {
  // const [copiedEntity, setCopiedEntity] = useState({ value: '', copied: false })
  const isSeq = data.item.length > 1
  const appDispatch = useContext(DispatchContext)
  const urlEscape = `%${[]
    .concat(data.glyph || [])
    .map(i => `${encodeURIComponent(i)}`)
    .join('%')}`
  const utf8 = urlEscape.split('%').join('\\x').trim()
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
  function escapeListenerCheck(e) {
    if (e.key === 'Escape') {
      window.removeEventListener('keydown', escapeListenerCheck)
      closeHandler()
    }
  }

  useEffect(() => window.addEventListener('keydown', escapeListenerCheck), [])
  const EntityData = ({ str, delim, dataType, flashMessage }) => {
    const regex = RegExp(`(?=${delim})`, 'g')
    return (
      <CopyToClipboard onCopy={() => copyFlashHandler(flashMessage)} text={str}>
        <p data-type={dataType} className={`pseudocopybutton ${styles.inspector_entity}`}>
          {str.split(regex).map(i => (
            <span>{i}</span>
          ))}
        </p>
      </CopyToClipboard>
    )
  }

  return (
    <div className="glyphInspector">
      <button className={styles.inspector_closebutton} onClick={() => closeHandler()}>
        {''}
      </button>
      <div className={styles.inspector_unit}>
        <div className={styles.inspector_column}>
          <CopyToClipboard
            onCopy={() => copyFlashHandler('Glyph')}
            className={`pseudocopybutton ${styles.inspector_bigglyph}
      ${data.unicat === 'Zs' ? ` sideborder` : ''}${data.unicat === 'Mn' || data.unicat === 'Cf' ? ` zerowidth` : ''}${data.isunavailable ? ` unavailable` : ''}`}
            text={data.characterString}>
            <h3>
              <span style={{ fontSize: `${OversizeCharCompensator(data.characterString)}em` }}>{data.isunavailable ? '' : data.characterString}</span>
            </h3>
          </CopyToClipboard>
          {data.isunavailable && <p className="unavailable--notice">Glyph only available in select fonts.</p>}
          <CopyToClipboard className={`pseudocopybutton ${styles.inspector_name}`} onCopy={() => copyFlashHandler('Glyph name')} text={data.processedName}>
            <p>
              <span>{data.processedName.replace(/( )([\w]{1,4})$/, '\u00a0$2')}</span>
            </p>
          </CopyToClipboard>
        </div>
        <div className={styles.inspector_column}>
          <div className={`${styles.inspector_info}`}>
            <EntityData str={htmlEntity} flashMessage={`HTML entity${isSeq ? ' sequence' : ''}`} dataType={`HTML Entity${isSeq ? ' sequence' : ''}`} delim="&" />
            <EntityData str={htmlEntityHex} flashMessage={`HTML entity${isSeq ? ' sequence' : ''} (hex)`} dataType={`HTML Entity${isSeq ? ' Sequence' : ''} (Hex)`} delim="&" />
            <EntityData str={cssEncode} flashMessage={`CSS encoding`} dataType="CSS Encoding" delim="\\" />
            <EntityData str={urlEscape} flashMessage={`URL escape code`} dataType={`URL Escape Code${urlEscape.split('%').length <= 2 ? '' : isSeq ? ' sequence' : 's'}`} delim="%" />
            <EntityData str={utf8} flashMessage={`UTF-8 Encoding`} dataType={`UTF-8 Encoding`} delim="\\x" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Inspector
