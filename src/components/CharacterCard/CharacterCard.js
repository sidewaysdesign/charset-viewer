import React from 'react'
import styles from './charactercard.module.css'

function CharacterCard({ item }) {
  const [unicodenum, charname] = item.split(';')
  console.table(unicodenum)
  return (
    <div className={styles.charactercard_container}>
      <h3 className="charactercard--bigletter">{String.fromCodePoint(parseInt(unicodenum, 16))}</h3>
      <p className="charactercard--name">{5}</p>
    </div>
  )
}
export default CharacterCard
