import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ArrowLeftIcon from 'react-feather/dist/icons/arrow-left'
import ExpandIcon from 'react-feather/dist/icons/chevron-right'
import ExpandUpIcon from 'react-feather/dist/icons/chevron-up'
import ExitIcon from 'react-feather/dist/icons/x'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { changeCentre, changeLayer } from '../../../state/ducks/map/actions'
import { getAirDataLive, getVisualDataLive } from '../../../state/ducks/sensor/actions'
import { showDataDetails, hideDataDetails } from '../../../state/ducks/charts/actions'
import { DESK, MOBILE } from '../../../utils/const'
import { AppBar } from '../../components/appbar/AppBar'
import { VisualLiveChart, HistoryChart, HistoryBrush, AirByHourChart, VisualByHourChart } from '../../components/charts'
import Map from '../../components/map/Map'
import { CompareBttn, LayersBttn, LegendsBttn } from '../../components/mapControl/ControlBttns/ControlBttns'
import { ParticleData } from '../../components/particleData/ParticleData'
import { TitleCard } from '../../components/titleCard/TitleCard'
import styles from './DataPage_desktop.module.scss'
import m_styles from './DataPage_mobile.module.scss'
import { timingSafeEqual } from 'crypto';

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
                  media={this.props.media}
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
                {(airSensor !== undefined) ? <h3>Air data by hour</h3>: <div></div>}
                {(airSensor !== undefined) ? <AirByHourChart />: <div></div>}
                {(visualSensor !== undefined) ? <h3>Vehicles by hour</h3>: <div></div>}
                {(visualSensor !== undefined) ? <VisualByHourChart />: <div></div>}
              </div> :
              <div className={styles.mapContainer}>
                <div className={styles.expandButton} onClick={this.props.showDataDetails}>
                  <ExpandIcon className={styles.icon} />
                </div>
                <Map media={this.props.media}/>
                <div className={styles.controlButton}>
                  <div onClick={this.handleLayerClick}>
                    <LayersBttn media={this.props.media} />
                  </div>
                  <div>
                    <LegendsBttn media={this.props.media} />
                  </div>
                  <div>
                    <CompareBttn media={this.props.media} />
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
          <div className={m_styles.content}>
            <div className={ m_styles.mapContainer }>
              <Map media={this.props.media}/>
              <div className={m_styles.backButton} onClick={this.handleBackClick}>
                <ArrowLeftIcon className={m_styles.icon} />
              </div>
              <div className={m_styles.layerButton} onClick={this.handleLayerClick}>
                <LayersBttn media={this.props.media}/>
              </div>
            </div>
            <div className={m_styles.data}>
              <div className={m_styles.expandButton} onClick={this.props.showDataDetails}>
                <ExpandUpIcon className={m_styles.icon} />
              </div>
              <div className={m_styles.titleCard}>
                <TitleCard
                  name={isAirLayer ? 
                    (airSensor===undefined ? 'No name.' : airSensor.description) : 
                    (visualSensor===undefined ? 'No name.' : visualSensor.description) }
                  suburb='No location data'
                  position={{
                    lng: this.props.mapCentre.lng,
                    lat: this.props.mapCentre.lat
                  }}
                  media={this.props.media}
                />
              </div>
              <h4>Live feed</h4>
              { airSensor === undefined ? 
                <h5 className={m_styles.noAir}>No air data.</h5> : 
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
                <h5 className={m_styles.noVisual}>No visual data.</h5> :
                <VisualLiveChart media={this.props.media}/>
              }
            </div>
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