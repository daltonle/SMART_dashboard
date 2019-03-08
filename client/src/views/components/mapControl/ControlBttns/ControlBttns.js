import React from 'react'
import { connect } from 'react-redux'
import { DESK } from '../../../../utils/const'
import InfoIcon from 'react-feather/dist/icons/info'
import SettingsIcon from 'react-feather/dist/icons/settings'
import CompareIcon from 'react-feather/dist/icons/bar-chart-2'
import ExitIcon from 'react-feather/dist/icons/x'
import ReactTooltip from 'react-tooltip'
import classNames from 'classnames'
import { HelpBttn } from '../../help-button/HelpBttn'
import { compose, withState, withHandlers } from 'recompose'
import { changeLayer, changeAirAttr, changeVisualAttr } from '../../../../state/ducks/map/actions'
import { ReactComponent as VisualLegend } from '../../../../assets/icons/visual_legend.svg'
import { ReactComponent as AirLegend } from '../../../../assets/icons/air_legend.svg'
import { airLevels, visualLevels } from '../../../../utils/markers'
import { markerColorScale } from '../../../../styles/colors'
import styles from './ControlBttns_desktop.module.scss'
import m_styles from './ControlBttns_mobile.module.scss'

/**
 * Control buttons used for map
 */

export const LegendsBttn = compose(
  withState('hidden', 'toggleDialogue', true),
  connect(state => ({
    airAttr: state.map.airAttr,
    visualAttr: state.map.visualAttr
  }), {})
)(({ media, hidden, toggleDialogue, airAttr, visualAttr }) => {
  const airColors = airLevels[airAttr].map((threshold, index) => (
    <div className={styles.sensorColorRow}>
      <div className={styles.colorBlock} style={{backgroundColor: markerColorScale[index]}}></div>
      <h5>{
        index === 0 ? (`0-${threshold}`) : (`${airLevels[airAttr][index-1]}-${threshold}`)
      }</h5>
    </div>
  ))
  airColors.push(
    <div className={styles.sensorColorRow}>
      <div className={styles.colorBlock} style={{backgroundColor: markerColorScale[airLevels[airAttr].length]}}></div>
      <h5>{
        `>${airLevels[airAttr][airLevels[airAttr].length-1]}`
      }</h5>
    </div>
  )
  const visualColors = visualLevels[visualAttr].map((threshold, index) => (
    <div className={styles.sensorColorRow}>
      <div className={styles.colorBlock} style={{backgroundColor: markerColorScale[index]}}></div>
      <h5>{
        index === 0 ? (`0-${threshold}`) : (`${visualLevels[visualAttr][index-1]}-${threshold}`)
      }</h5>
    </div>
  ))
  visualColors.push(
    <div className={styles.sensorColorRow}>
      <div className={styles.colorBlock} style={{backgroundColor: markerColorScale[visualLevels[visualAttr].length]}}></div>
      <h5>{
        `>${visualLevels[visualAttr][visualLevels[visualAttr].length-1]}`
      }</h5>
    </div>
  )

  if (media === DESK)
    return (
      <div className={styles.legendContainer}>
        <button className={styles.bttn} data-tip data-for='legends'
        onClick={() => toggleDialogue(n => !n)}>
          <InfoIcon className={styles.icon} />
          <ReactTooltip id='legends' place="left" type="light" effect="solid">
            <span>Legends</span>
          </ReactTooltip>
        </button>
        <div className={classNames({ [styles.info]: true, [styles.hidden]: hidden })}>
          <h3>Legends</h3>
          <h5>Sensor type</h5>
          <div className={styles.sensorType}>
            <div className={styles.sensorTypeItem}>
              <AirLegend />
              <h5>Air</h5>
            </div>
            <div className={styles.sensorTypeItem}>
              <VisualLegend />
              <h5>Visual</h5>
            </div>
          </div>
          <h5>Number of objects/particles detected</h5>
          <div className={styles.sensorColor}>
            <div className={styles.sensorColorItem}>
              <h5>Air</h5>
              {airColors}
            </div>
            <div className={styles.sensorColorItem}>
              <h5>Visual</h5>
              {visualColors}
            </div>
          </div>
        </div>
      </div>
    )
  else return (
    <div className={styles.legendContainer}>
      <button className={styles.bttn} onClick={() => toggleDialogue(n => !n)}>
        <InfoIcon className={styles.icon} />
      </button>
      <div className={classNames({ [styles.info]: true, [styles.hidden]: hidden })}
      style={{top: `initial`, bottom: 0, right: 0, transform: `none`}}>
        <div className={m_styles.legendHeader}>
          <h3>Legend</h3>
          <ExitIcon onClick={() => toggleDialogue(n => !n)} className={m_styles.icon}/>
        </div>
        <h5>Sensor type</h5>
        <div className={styles.sensorType}>
          <div className={styles.sensorTypeItem}>
            <AirLegend />
            <h5>Air</h5>
          </div>
          <div className={styles.sensorTypeItem}>
            <VisualLegend />
            <h5>Visual</h5>
          </div>
        </div>
        <h5>Number of objects/particles detected</h5>
        <div className={styles.sensorColor}>
          <div className={styles.sensorColorItem}>
            <h5>Air</h5>
            {airColors}
          </div>
          <div className={styles.sensorColorItem}>
            <h5>Visual</h5>
            {visualColors}
          </div>
        </div>
      </div>
    </div>
  )
})

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
    changeVisualAttr,
    sensorTypeDisabled,
  } = props
  
  if (media === DESK)
    return (
      <div className={styles.settingsContainer}>
        <button className={styles.bttn} data-tip data-for='layers' 
        onClick={() => toggleDialogue(n => !n)} >
          <SettingsIcon className={styles.icon} />
          <ReactTooltip id='layers' place="left" type="light" effect="solid">
            <span>Settings</span>
          </ReactTooltip>
        </button>
        <div className={classNames({[styles.dialogue]: true, [styles.hidden]: hidden})}>
          {sensorTypeDisabled ? <div></div> : <h4>Sensor type</h4>}
          {sensorTypeDisabled ? <div></div> :
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
          }
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
    <div className={m_styles.settingsContainer}>
      <button className={styles.bttnMobile} data-tip data-for='layers' 
      onClick={() => toggleDialogue(n => !n)} >
        <SettingsIcon className={m_styles.icon} />
      </button>
      <div className={classNames({[m_styles.dialogue]: true, [m_styles.hidden]: hidden})}>
        {sensorTypeDisabled ?
          <div className={m_styles.header} style={{height: `2.5rem`}}>
            <ExitIcon onClick={() => toggleDialogue(n => !n)} className={m_styles.icon}/>
          </div> :
          <div className={m_styles.header}>
            <h4>Sensor type</h4>
            <ExitIcon onClick={() => toggleDialogue(n => !n)} className={m_styles.icon}/>
          </div>
        }
        {sensorTypeDisabled ? <div></div> :
          <div className={m_styles.sensorType}>
            <div 
              className={classNames({ [m_styles.layerItemActive]: layers.air, [m_styles.layerItemInactive]: !layers.air})}
              onClick={handleToggleAir}>
              <h4>Air</h4>            
            </div>
            <div 
              className={classNames({ [m_styles.layerItemActive]: layers.visual, [m_styles.layerItemInactive]: !layers.visual})}
              onClick={handleToggleVisual}>
              <h4>Visual</h4>            
            </div>
          </div>
        }
        <div className={m_styles.header}>
          <h4>Filter attribute</h4>
          <HelpBttn
            name="filter-attr"
            message='Attribute which markers levels are based on'
          />
        </div>
        <div className={m_styles.options} style={{zIndex: 1009}}>
          <div className={m_styles.attrName}>
            <h5>Air</h5>
          </div>
          <div onClick={() => changeAirAttr('pm2_5')} className={classNames({ [m_styles.item]: true, [m_styles.chosen]: airAttr==='pm2_5'})}>
            <h5>PM2.5</h5>
          </div>
          <div onClick={() => changeAirAttr('pm10')} className={classNames({ [m_styles.item]: true, [m_styles.chosen]: airAttr==='pm10'})}>
            <h5>PM10</h5>
          </div>
        </div>
        <div className={m_styles.options} style={{zIndex: 0}}>
          <div className={m_styles.attrName}>
            <h5>Visual</h5>
          </div>
          <div onClick={() => changeVisualAttr('pedestrian')} className={classNames({ [m_styles.item]: true, [m_styles.chosen]: visualAttr==='pedestrian'})}>
            <h5>Pedestrian</h5>
          </div>
          <div onClick={() => changeVisualAttr('bicycle')} className={classNames({ [m_styles.item]: true, [m_styles.chosen]: visualAttr==='bicycle'})}>
            <h5>Bicycle</h5>
          </div>
          <div onClick={() => changeVisualAttr('vehicle')} className={classNames({ [m_styles.item]: true, [m_styles.chosen]: visualAttr==='vehicle'})}>
            <h5>Vehicle</h5>
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