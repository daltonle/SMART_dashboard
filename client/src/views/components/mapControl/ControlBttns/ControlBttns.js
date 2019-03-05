import React from 'react'
import { connect } from 'react-redux'
import { DESK } from '../../../../utils/const'
import InfoIcon from 'react-feather/dist/icons/info'
import LayersIcon from 'react-feather/dist/icons/layers'
import CompareIcon from 'react-feather/dist/icons/bar-chart-2'
import ReactTooltip from 'react-tooltip'
import classNames from 'classnames'
import { compose, withState, withHandlers } from 'recompose'
import { changeLayer } from '../../../../state/ducks/map/actions'
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
/*
export class LayersBttn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hidden: true,
      air: props.layers.air,
      visual: props.layers.visual
    }
  }


}
*/
export const LayersBttn = compose(
  withState('hidden', 'toggleDialogue', true),
  connect(state => ({layers: state.map.layers}), { changeLayer }),
  withHandlers(() => ({
    handleToggleAir: ({ changeLayer }) => () => {
      changeLayer('air')
    },
    handleToggleVisual: ({ changeLayer }) => () => {
      changeLayer('visual')
    }
  }))
)(({ media, hidden, toggleDialogue, layers, handleToggleAir, handleToggleVisual }) => {
  if (media === DESK)
    return (
      <div className={styles.container}>
        <button className={styles.bttn} data-tip data-for='layers' onClick={() => toggleDialogue(n => !n)}>
          <LayersIcon className={styles.icon} />
          <ReactTooltip id='layers' place="left" type="light" effect="solid">
            <span>Switch layer</span>
          </ReactTooltip>
        </button>
        <div className={classNames({[styles.dialogue]: true, [styles.hidden]: hidden})}>
          <h3>Sensor type</h3>
          <div className={styles.sensorType}>
            <div 
              className={classNames({ [styles.layerItemActive]: layers.air, [styles.layerItemInactive]: !layers.air})}
              onClick={handleToggleAir}>
              <h4>Air</h4>            
            </div>
            <div 
              className={classNames({ [styles.layerItemActive]: layers.visual, [styles.layerItemInactive]: !layers.visual})}
              onClick={handleToggleVisual}>
              <h4>Visual</h4>            
            </div>
          </div>
        </div>
      </div>
    )
  else return (
    <button className={styles.bttnMobile}>
      <LayersIcon className={styles.icon} />
    </button>
  )
})

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