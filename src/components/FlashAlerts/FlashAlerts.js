import React from 'react'
import styles from './flashalerts.module.css'

function FlashAlerts({ messages }) {
  return (
    <div className={styles.flashAlerts}>
      {messages.map((msg, index) => {
        return (
          <div key={index} className={styles.flashAlert}>
            {msg}
          </div>
        )
      })}
    </div>
  )
}

export default FlashAlerts
