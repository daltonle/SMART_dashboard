import React from 'react'
import HelpIcon from 'react-feather/dist/icons/help-circle'
import ReactTooltip from 'react-tooltip'
import styles from './HelpBttn.module.scss'
import './HelpBttn.css'

export const HelpBttn = ({ name, message }) => {
  return (
    <div className={styles.bttn} data-tip={message} data-for={`${name}`}>
      <HelpIcon className={styles.icon} />
      <ReactTooltip id={`${name}`} place="left" type="light" effect="solid" html={true} className={styles.theme}>
        {message}
      </ReactTooltip>
    </div>
  )
}

// TODO: try prop globalEventOff="touchstart" to make tooltip dismiss on mobile