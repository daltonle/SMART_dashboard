import React from 'react'
import { DESK, MOBILE } from '../../../../utils/const'
import InfoIcon from 'react-feather/dist/icons/info'
import LayersIcon from 'react-feather/dist/icons/layers'
import CompareIcon from 'react-feather/dist/icons/bar-chart-2'
import ReactTooltip from 'react-tooltip'
import styles from './ControlBttns.module.scss'

/**
 * Control buttons used for desktop map
 */

export const LegendsBttn = ({ media }) => {
  if (media === DESK)
    return (
      <button className={styles.bttn} data-tip data-for='legends'>
        <InfoIcon className={styles.icon} />
        <ReactTooltip id='legends' place="left" type="light" effect="solid">
          <span>Legends</span>
        </ReactTooltip>
      </button>
    )
  else return (
    <button className={styles.bttnMobile}>
      <InfoIcon className={styles.icon} />
    </button>
  )
}

export const LayersBttn = ({ media }) => {
  if (media === DESK)
    return (
      <button className={styles.bttn} data-tip data-for='layers'>
        <LayersIcon className={styles.icon} />
        <ReactTooltip id='layers' place="left" type="light" effect="solid">
          <span>Switch layer</span>
        </ReactTooltip>
      </button>
    )
  else return (
    <button className={styles.bttnMobile}>
      <LayersIcon className={styles.icon} />
    </button>
  )
}

export const CompareBttn = ({ media }) => {
  if (media === DESK)
    return (
      <button className={styles.bttn} data-tip data-for='compare'>
        <CompareIcon className={styles.icon} />
        <ReactTooltip id='compare' place="left" type="light" effect="solid">
          <span>Compare</span>
        </ReactTooltip>
      </button>
    )
  else return (
    <button className={styles.bttnMobile}>
      <CompareIcon className={styles.icon} />
    </button>
  )
}