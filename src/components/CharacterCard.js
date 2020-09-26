import React from 'react'
function CharacterCard({ unicodeval, name }) {
  return (
    <>
      <div className="charactercard--container">
        <h3 className="charactercard--bigletter">{String.fromCodePoint(unicodeVal)}</h3>
        <p className="charactercard--name">{name}</p>
      </div>
    </>
  )
}
export default CharacterCard
