import React from 'react'
import InfoIcon from 'react-feather/dist/icons/info'
import LayersIcon from 'react-feather/dist/icons/layers'
import CompareIcon from 'react-feather/dist/icons/bar-chart-2'
import ReactTooltip from 'react-tooltip'
import styles from './.module.scss'

/**
 * Control buttons used for desktop map
 */

export const LegendsBttn = () => (
  <button className={styles.bttn} data-tip data-for='legends'>
    <InfoIcon className={styles.icon} />
    <ReactTooltip id='legends' place="left" type="light" effect="solid">
      <span>Legends</span>
    </ReactTooltip>
  </button>
)

export const LayersBttn = () => (
  <button className={styles.bttn} data-tip data-for='layers'>
    <LayersIcon className={styles.icon} />
    <ReactTooltip id='layers' place="left" type="light" effect="solid">
      <span>Switch layer</span>
    </ReactTooltip>
  </button>
)

export const CompareBttn = () => (
  <button className={styles.bttn} data-tip data-for='compare'>
    <CompareIcon className={styles.icon} />
    <ReactTooltip id='compare' place="left" type="light" effect="solid">
      <span>Compare</span>
    </ReactTooltip>
  </button>
)