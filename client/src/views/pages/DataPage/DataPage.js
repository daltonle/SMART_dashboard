import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ArrowLeftIcon from 'react-feather/dist/icons/arrow-left'
import ExpandIcon from 'react-feather/dist/icons/chevron-right'
import ExitIcon from 'react-feather/dist/icons/x'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { changeCentre, changeLayer } from '../../../state/ducks/map/actions'
import { getAirDataLive, getVisualDataLive } from '../../../state/ducks/sensor/actions'
import { showDataDetails, hideDataDetails } from '../../../state/ducks/charts/actions'
import { DESK, MOBILE } from '../../../utils/const'
import { AppBar } from '../../components/appbar/AppBar'
import { VisualLiveChart, HistoryChart, HistoryBrush } from '../../components/charts'
import Map from '../../components/map/Map'
import { CompareBttn, LayersBttn, LegendsBttn } from '../../components/mapControl/ControlBttns/ControlBttns'
import { ParticleData } from '../../components/particleData/ParticleData'
import { TitleCard } from '../../components/titleCard/TitleCard'
import styles from './DataPage_desktop.module.scss'
import m_styles from './DataPage_mobile.module.scss'

class DataPage extends Component {
  static propTypes = {
    media: PropTypes.string,
    match: PropTypes.object,
    isAirLayer: PropTypes.bool,
    airSensor: PropTypes.object,
    visualSensor: PropTypes.object,
    mapCentre: PropTypes.object,
    doShowDetails: PropTypes.bool,
    
    changeLayer: PropTypes.func,
    changeCentre: PropTypes.func,
    getAirDataLive: PropTypes.func,
    getVisualDataLive: PropTypes.func,
    showDataDetails: PropTypes.func,
    hideDataDetails: PropTypes.func
  }
  
  // After component mounted, change map centre to the new position,
  // then fetch live data of sensors
  componentDidMount = () => {
    let { 
      isAirLayer,
      match,
      mapCentre,
      getAirDataLive,
      getVisualDataLive,
      changeCentre
    } = this.props

    let newCentre = {
      lng: parseFloat(match.params.long),
      lat: parseFloat(match.params.lat)
    }
    if (mapCentre !== newCentre)
    changeCentre(newCentre)

    if (isAirLayer)
      getAirDataLive(newCentre)
    else getVisualDataLive(newCentre)
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.mapCentre !== prevProps.mapCentre) {
      if (this.props.isAirLayer)
        this.props.getAirDataLive(this.props.mapCentre)
      else this.props.getVisualDataLive(this.props.mapCentre)
    }
  }

  handleLayerClick = (e) => {
    e.preventDefault()
    this.props.changeLayer()
  }

  // REVIEW: push() or goBack()
  handleBackClick = (e) => {
    e.preventDefault()
    this.props.history.push('/dashboard')
  }

  render() {
    let { airSensor, visualSensor, isAirLayer, doShowDetails } = this.props

    if (this.props.media === DESK)
      return (
        <div className={styles.outer}>
          <div className={styles.appbar}>
            <AppBar media={this.props.media} />
          </div>
          <div className={styles.content}>
            <div className={classNames(styles.data, { [styles.detailsShown]: this.props.doShowDetails })}>
              <ArrowLeftIcon className={styles.backButton} onClick={this.handleBackClick}/>
              <div className={styles.titleCard}>
                <TitleCard
                  name={isAirLayer ? 
                    (airSensor===undefined ? 'No name.' : airSensor.description) : 
                    (visualSensor===undefined ? 'No name.' : visualSensor.description) }
                  suburb='No location data'
                  position={{
                    lng: this.props.mapCentre.lng,
                    lat: this.props.mapCentre.lat
                  }}
                />
              </div>
              <h3>Live feed</h3>
              { airSensor === undefined ? 
                <h5 className={styles.noAir}>No air data.</h5> : 
                <div className={styles.airDataContainer}>
                  <div>
                    <ParticleData
                      data={airSensor === undefined ? -1 : airSensor.pm2_5}
                      level={1}
                      unit="ug/m3"
                    />
                    <h5>PM2.5</h5>
                  </div>
                  <div>
                    <ParticleData
                      data={airSensor === undefined ? -1 : airSensor.pm10}
                      level={1}
                      unit="ug/m3"
                    />
                    <h5>PM10</h5>
                  </div>
                </div>
              }
              
              { visualSensor === undefined ? 
                <h5 className={styles.noVisual}>No visual data.</h5> :
                <VisualLiveChart />
              }
            </div>
            { doShowDetails ? 
              <div className={styles.chartDetails}>
                <div className={styles.exitButton} onClick={this.props.hideDataDetails}>
                  <ExitIcon className={styles.icon}/>
                </div>
                <h3>History</h3>
                <HistoryChart />
                <HistoryBrush />
                <h3>Vehicles per hour</h3>
              </div> :
              <div className={styles.mapContainer}>
                <div className={styles.expandButton} onClick={this.props.showDataDetails}>
                  <ExpandIcon className={styles.icon} />
                </div>
                <Map />
                <div className={styles.controlButton}>
                  <div onClick={this.handleLayerClick}>
                    <LayersBttn />
                  </div>
                  <div>
                    <LegendsBttn />
                  </div>
                  <div>
                    <CompareBttn />
                  </div>
                </div>
              </div>
            }
            
          </div>
        </div>
      );
    else if (this.props.media === MOBILE)
      return (
        <div className={ m_styles.outer }>
          <div className={ m_styles.mapContainer }>
            <Map />
          </div>
          <div className={ m_styles.appbar }>
            <AppBar media={this.props.media} />
          </div>
        </div>
      )
  }
}

const mapStateToProps = state => ({
  isAirLayer: state.map.isAirLayer,
  airSensor: state.sensor.air,
  visualSensor: state.sensor.visual,
  mapCentre: state.map.centre,
  doShowDetails: state.charts.showDetails
})

const mapDispatchToProps = {
  changeLayer,
  changeCentre,
  getAirDataLive,
  getVisualDataLive,
  showDataDetails,
  hideDataDetails
}

export default connect(mapStateToProps, mapDispatchToProps)(DataPage)