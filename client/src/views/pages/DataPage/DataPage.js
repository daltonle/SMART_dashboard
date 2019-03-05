import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ArrowLeftIcon from 'react-feather/dist/icons/arrow-left'
import ExpandIcon from 'react-feather/dist/icons/chevron-right'
import ExpandUpIcon from 'react-feather/dist/icons/chevron-up'
import ExitIcon from 'react-feather/dist/icons/x'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { changeCentre, changeLayer } from '../../../state/ducks/map/actions'
import { getAirData, getVisualData } from '../../../state/ducks/sensor/actions'
import { DESK, MOBILE } from '../../../utils/const'
import { AppBar } from '../../components/appbar/AppBar'
import { VisualLiveChart, HistoryChart, AirByHourChart, VisualByHourChart, AirOfDayChart, VisualOfDayChart, VisualHeatmap, TrajectoryChart } from '../../components/charts'
import Map from '../../components/map/Map'
import { CompareBttn, LayersBttn, LegendsBttn } from '../../components/mapControl/ControlBttns/ControlBttns'
import { HelpBttn } from '../../components/help-button/HelpBttn'
import { ParticleData } from '../../components/particleData/ParticleData'
import { TitleCard } from '../../components/titleCard/TitleCard'
import styles from './DataPage_desktop.module.scss'
import m_styles from './DataPage_mobile.module.scss'

class DataPage extends Component {
  static propTypes = {
    media: PropTypes.string,
    match: PropTypes.object,
    layers: PropTypes.object,
    airSensor: PropTypes.object,
    visualSensor: PropTypes.object,
    mapCentre: PropTypes.object,
    doShowDetails: PropTypes.bool,
    
    changeLayer: PropTypes.func,
    changeCentre: PropTypes.func,
    getAirData: PropTypes.func,
    getVisualData: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      doShowDetails: false
    }
  }
  
  // After component mounted, change map centre to the new position,
  // then fetch live data of sensors
  componentDidMount = () => {
    const {
      match,
      history,
      mapCentre,
      getAirData,
      getVisualData,
      changeCentre
    } = this.props
    console.log(history.location)

    let newCentre = {
      lng: parseFloat(match.params.long),
      lat: parseFloat(match.params.lat)
    }
    if (mapCentre !== newCentre)
      changeCentre(newCentre)

    if (history.location.state !== undefined) {
      if (history.location.state.type === undefined)
        this.props.history.push('/dashboard')
      else if (history.location.state.type === 'air')
        getAirData(newCentre)
      else if (history.location.state.type === 'visual')
        getVisualData(newCentre)    
    } else this.props.history.push('/dashboard')
  }

  componentDidUpdate = (prevProps) => {
    const { history } = this.props
    if (this.props.mapCentre !== prevProps.mapCentre) {
      if (history.location.state.type === 'air')
        this.props.getAirData(this.props.mapCentre)
      else if (history.location.state.type === 'visual')
        this.props.getVisualData(this.props.mapCentre)
    }
  }

  handleExpand = (e) => {
    e.preventDefault()
    this.setState({ doShowDetails: true })
  }

  handleCollapse = (e) => {
    e.preventDefault()
    this.setState({ doShowDetails: false })
  }

  handleLayerClick = (e) => {
    e.preventDefault()
    // TODO: add handler
  }

  handleCompareClick = (e) => {
    e.preventDefault()
    this.props.history.push('/compare')
  }

  handleBackClick = (e) => {
    e.preventDefault()
    this.props.history.push('/dashboard')
  }

  render() {
    const { airSensor, visualSensor, layers, history } = this.props
    const { location } = history
    const { doShowDetails } = this.state

    if (this.props.media === DESK)
      return (
        <div className={styles.outer}>
          <div className={styles.appbar}>
            <AppBar active="dashboard" media={this.props.media} />
          </div>
          <div className={styles.content}>
            <div className={classNames(styles.data, { [styles.detailsShown]: doShowDetails })}>
              <ArrowLeftIcon className={styles.backButton} onClick={this.handleBackClick}/>
              <div className={styles.titleCard}>
                <TitleCard
                  name={(location.state === undefined) ? "No name" :
                        (location.state.type==='air') ? 
                        (airSensor===undefined ? 'No name.' : airSensor.description) : 
                        (location.state.type==='visual') ?
                        (visualSensor===undefined ? 'No name.' : visualSensor.description) : "No name."}
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
                <div style={{display: `none`}}></div> : 
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
                <div style={{display: `none`}}></div> :
                <VisualLiveChart />
              }
            </div>
            { doShowDetails ? 
              <div className={styles.chartDetails}>
                <div className={styles.exitButton} onClick={this.handleCollapse}>
                  <ExitIcon className={styles.icon}/>
                </div>
                <div className={styles.header} style={{marginTop: 0}}>
                  <h3>History</h3>
                  <HelpBttn 
                    name="history-chart" 
                    message="Data collected over time" 
                  />
                </div>
                <HistoryChart media={DESK} />
                {(airSensor !== undefined) ? 
                  <div className={styles.header}>
                    <h3>Air data by hour</h3>
                    <HelpBttn 
                      name="air-by-hour-chart" 
                      message='Air quality data in each hour on each day of the week.<br><br>Use dropdown dialogue to view average/<br>minimum/maximum data.'
                    />
                  </div> : <div></div>
                }
                {(airSensor !== undefined) ? <AirByHourChart media={DESK} />: <div></div>}
                {(airSensor !== undefined) ? 
                  <div className={styles.header}>
                    <h3>Air data of a day</h3>
                    <HelpBttn 
                      name="air-of-day-chart" 
                      message="Choose a date to view air quality data of that day." 
                    />
                  </div> : <div></div>
                }
                {(airSensor !== undefined) ? <AirOfDayChart media={DESK} />: <div></div>}
                {(visualSensor !== undefined) ? 
                  <div className={styles.header}>
                    <h3>Vehicles by hour</h3>
                    <HelpBttn 
                      name="vehicles-by-hour-chart" 
                      message="Traffic data in each hour on each day of the week." 
                    />
                  </div>: <div></div>}
                {(visualSensor !== undefined) ? <VisualByHourChart media={DESK} />: <div></div>}
                {(visualSensor !== undefined) ? 
                  <div className={styles.header}>
                    <h3>Visual data of a day</h3>
                    <HelpBttn 
                      name="vehicles-of-day-chart" 
                      message="Choose a date to view traffic data on that day." 
                    />
                  </div> : <div></div>}
                {(visualSensor !== undefined) ? <VisualOfDayChart media={DESK} />: <div></div>}
                {(visualSensor !== undefined) ? 
                  <div className={styles.header}>
                    <h3>Object detection</h3>
                    <HelpBttn 
                      name="heatmap" 
                      message="This heatmap shows the object movement captured by the camera." 
                    />
                  </div> : <div></div>}
                {(visualSensor !== undefined) ? <VisualHeatmap media={DESK} />: <div></div>}
                {(visualSensor !== undefined) ? 
                  <div className={styles.header}>
                    <h3>Trajectory tracking</h3>
                    <HelpBttn 
                      name="trajectory" 
                      message="This chart shows the trajectory of object centre detected by the camera." 
                    />
                  </div> : <div></div>}
                {(visualSensor !== undefined) ? <TrajectoryChart media={DESK} />: <div></div>}
              </div> :
              <div className={styles.mapContainer}>
                <div className={styles.expandButton} onClick={this.handleExpand}>
                  <ExpandIcon className={styles.icon} />
                </div>
                <Map media={this.props.media} zoomLevel={15}/>
                <div className={styles.controlButton}>
                  <div onClick={this.handleLayerClick}>
                    <LayersBttn media={this.props.media} />
                  </div>
                  <div>
                    <LegendsBttn media={this.props.media} />
                  </div>
                  <div onClick={this.handleCompareClick}>
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
          { doShowDetails ? 
          <div className={m_styles.chartDetails}>
            <div className={m_styles.backButton} onClick={this.handleBackClick}>
              <ArrowLeftIcon className={m_styles.icon} />
            </div>
            <div className={m_styles.titleCard}>
              <TitleCard
                name={(location.state === undefined) ? "No name" :
                      (location.state.type==='air') ? 
                      (airSensor===undefined ? 'No name.' : airSensor.description) : 
                      (location.state.type==='visual') ?
                      (visualSensor===undefined ? 'No name.' : visualSensor.description) : "No name."}
                suburb='No location data'
                position={{
                  lng: this.props.mapCentre.lng,
                  lat: this.props.mapCentre.lat
                }}
                media={this.props.media}
                full={true}
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
              <VisualLiveChart />
            }
            <div className={m_styles.header} style={{marginTop: 0}}>
              <h3>History</h3>
              <HelpBttn 
                name="history-chart" 
                message="Data collected over time" 
              />
            </div>
            <HistoryChart media={MOBILE} />
            {(airSensor !== undefined) ? 
              <div className={m_styles.header}>
                <h3>Air data by hour</h3>
                <HelpBttn 
                  name="air-by-hour-chart" 
                  message='Air quality data in each hour on each day of the week.<br><br>Use dropdown dialogue to view average/<br>minimum/maximum data.'
                />
              </div> : <div></div>
            }
            {(airSensor !== undefined) ? <AirByHourChart media={MOBILE} />: <div></div>}
            {(airSensor !== undefined) ? 
              <div className={m_styles.header}>
                <h3>Air data of a day</h3>
                <HelpBttn 
                  name="air-of-day-chart" 
                  message="Choose a date to view air quality data of that day." 
                />
              </div> : <div></div>
            }
            {(airSensor !== undefined) ? <AirOfDayChart media={MOBILE} />: <div></div>}
            {(visualSensor !== undefined) ? 
              <div className={m_styles.header}>
                <h3>Vehicles by hour</h3>
                <HelpBttn 
                  name="vehicles-by-hour-chart" 
                  message="Traffic data in each hour on each day of the week." 
                />
              </div>: <div></div>}
            {(visualSensor !== undefined) ? <VisualByHourChart media={MOBILE} />: <div></div>}
            {(visualSensor !== undefined) ? 
              <div className={m_styles.header}>
                <h3>Visual data of a day</h3>
                <HelpBttn 
                  name="vehicles-of-day-chart" 
                  message="Choose a date to view traffic data on that day." 
                />
              </div> : <div></div>}
            {(visualSensor !== undefined) ? <VisualOfDayChart media={MOBILE} />: <div></div>}
            {(visualSensor !== undefined) ? 
              <div className={m_styles.header} style={{marginBottom: `.5rem`}}>
                <h3>Object detection</h3>
                <HelpBttn 
                  name="heatmap" 
                  message="This heatmap shows the object movement captured by the camera." 
                />
              </div> : <div></div>}
            {(visualSensor !== undefined) ? <VisualHeatmap media={MOBILE} />: <div></div>}
            {(visualSensor !== undefined) ? 
              <div className={m_styles.header}>
                <h3>Trajectory tracking</h3>
                <HelpBttn 
                  name="trajectory" 
                  message="This chart shows the trajectory of object centre detected by the camera." 
                />
              </div> : <div></div>}
            {(visualSensor !== undefined) ? <TrajectoryChart media={MOBILE} />: <div></div>}
          </div> :
          <div className={m_styles.content}>
            <div className={ m_styles.mapContainer }>
              <Map media={this.props.media} zoomLevel={15}/>
              <div className={m_styles.backButton} onClick={this.handleBackClick}>
                <ArrowLeftIcon className={m_styles.icon} />
              </div>
              <div className={m_styles.layerButton} onClick={this.handleLayerClick}>
                <LayersBttn media={this.props.media}/>
              </div>
            </div>
            <div className={m_styles.data}>
              <div className={m_styles.expandButton} onClick={this.handleExpand}>
                <ExpandUpIcon className={m_styles.icon} />
              </div>
              <div className={m_styles.titleCard}>
                <TitleCard
                  name={(location.state === undefined) ? "No name" :
                        (location.state.type==='air') ? 
                        (airSensor===undefined ? 'No name.' : airSensor.description) : 
                        (location.state.type==='visual') ?
                        (visualSensor===undefined ? 'No name.' : visualSensor.description) : "No name."}
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
                <VisualLiveChart />
              }
            </div>
          </div>
          }
          
          <div className={ m_styles.appbar }>
            <AppBar active="dashboard" media={this.props.media} />
          </div>
        </div>
      )
  }
}

const mapStateToProps = state => ({
  layers: state.map.layers,
  airSensor: state.sensor.air,
  visualSensor: state.sensor.visual,
  mapCentre: state.map.centre
})

const mapDispatchToProps = {
  changeLayer,
  changeCentre,
  getAirData,
  getVisualData
}

export default connect(mapStateToProps, mapDispatchToProps)(DataPage)