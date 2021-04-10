import React from 'react'
import styles from './flashalerts.module.css'

function FlashAlerts(props) {
  return (
    <div className="flash-alerts">
      {props.messages.map((msg, index) => {
        return (
          <div key={index} className="flash-alert">
            {msg}
          </div>
        )
      })}
    </div>
  )
}

export default FlashAlerts
