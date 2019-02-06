import React from 'react'
import InfoIcon from 'react-feather/dist/icons/info'
import LayersIcon from 'react-feather/dist/icons/layers'
import CompareIcon from 'react-feather/dist/icons/bar-chart-2'
import styles from './.module.scss'

/**
 * Control buttons used for desktop map
 */

export const LegendsBttn = () => (
  <button className={styles.bttn}>
    <InfoIcon className={styles.icon} />
  </button>
)

export const LayersBttn = () => (
  <button className={styles.bttn}>
    <LayersIcon className={styles.icon} />
  </button>
)

export const CompareBttn = () => (
  <button className={styles.bttn}>
    <CompareIcon className={styles.icon} />
  </button>
)