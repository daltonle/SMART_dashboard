import React from 'react'
import { connect } from 'react-redux'
import { DESK } from '../../../../utils/const'
import InfoIcon from 'react-feather/dist/icons/info'
import SettingsIcon from 'react-feather/dist/icons/settings'
import CompareIcon from 'react-feather/dist/icons/bar-chart-2'
import ReactTooltip from 'react-tooltip'
import classNames from 'classnames'
import { HelpBttn } from '../../help-button/HelpBttn'
import { compose, withState, withHandlers } from 'recompose'
import { changeLayer, changeAirAttr, changeVisualAttr } from '../../../../state/ducks/map/actions'
import styles from './ControlBttns.module.scss'

/**
 * Control buttons used for map
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

export const SettingsBttn = compose(
  withState('hidden', 'toggleDialogue', true),
  withState('airAttr', 'handleAirAttrChanged', 'pm2_5'),
  connect(state => ({
    layers: state.map.layers,
    airAttr: state.map.airAttr,
    visualAttr: state.map.visualAttr
  }), { changeLayer, changeAirAttr, changeVisualAttr }),
  withHandlers(() => ({
    handleToggleAir: ({ changeLayer }) => () => {
      changeLayer('air')
    },
    handleToggleVisual: ({ changeLayer }) => () => {
      changeLayer('visual')
    }
  }))
)((props) => {
  const { 
    media, 
    hidden, 
    toggleDialogue, 
    layers, 
    handleToggleAir, 
    handleToggleVisual, 
    airAttr, 
    visualAttr, 
    changeAirAttr, 
    changeVisualAttr } = props
  
  if (media === DESK)
    return (
      <div className={styles.container}>
        <button className={styles.bttn} data-tip data-for='layers' 
        onClick={() => toggleDialogue(n => !n)} >
          <SettingsIcon className={styles.icon} />
          <ReactTooltip id='layers' place="left" type="light" effect="solid">
            <span>Settings</span>
          </ReactTooltip>
        </button>
        <div className={classNames({[styles.dialogue]: true, [styles.hidden]: hidden})}>
          <h4>Sensor type</h4>
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
          <div className={styles.header}>
            <h4>Filter attribute</h4>
            <HelpBttn
              name="filter-attr"
              message='Attribute which markers levels are based on'
            />
          </div>
          <div className={styles.options} style={{zIndex: 1009}}>
            <div className={styles.attrName}>
              <h5>Air</h5>
            </div>
            <div onClick={() => changeAirAttr('pm2_5')} className={classNames({ [styles.item]: true, [styles.chosen]: airAttr==='pm2_5'})}>
              <h5>PM2.5</h5>
            </div>
            <div onClick={() => changeAirAttr('pm10')} className={classNames({ [styles.item]: true, [styles.chosen]: airAttr==='pm10'})}>
              <h5>PM10</h5>
            </div>
          </div>
          <div className={styles.options} style={{zIndex: 0}}>
            <div className={styles.attrName}>
              <h5>Visual</h5>
            </div>
            <div onClick={() => changeVisualAttr('pedestrian')} className={classNames({ [styles.item]: true, [styles.chosen]: visualAttr==='pedestrian'})}>
              <h5>Pedestrian</h5>
            </div>
            <div onClick={() => changeVisualAttr('bicycle')} className={classNames({ [styles.item]: true, [styles.chosen]: visualAttr==='bicycle'})}>
              <h5>Bicycle</h5>
            </div>
            <div onClick={() => changeVisualAttr('vehicle')} className={classNames({ [styles.item]: true, [styles.chosen]: visualAttr==='vehicle'})}>
              <h5>Vehicle</h5>
            </div>
          </div>
        </div>
      </div>
    )
  else return (
    <div className={styles.container}>
      <button className={styles.bttn} data-tip data-for='layers' 
      onClick={() => {
        toggleDialogue(n => !n)
        setTimeout(() => {
          toggleDialogue(n => !n)
        }, 5000);
      }}>
        <SettingsIcon className={styles.icon} />
        <ReactTooltip id='layers' place="left" type="light" effect="solid">
          <span>Settings</span>
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