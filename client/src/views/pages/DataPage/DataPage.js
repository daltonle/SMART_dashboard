import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { DESK, MOBILE } from '../../../utils/const';
import { AppBar } from '../../components/appbar/AppBar';
import Map from '../../components/map/Map';
import { CompareBttn, LayersBttn, LegendsBttn } from '../../components/mapControl/ControlBttns/ControlBttns';
import { changeLayer, changeCentre } from '../../../state/ducks/map/actions'
import styles from './DataPage_desktop.module.scss';
import { TitleCard } from '../../components/titleCard/TitleCard'
import ArrowLeftIcon from 'react-feather/dist/icons/arrow-left'
import { getAirDataLive, getVisualDataLive } from '../../../state/ducks/sensor/actions'
import { ParticleData } from '../../components/particleData/ParticleData';


class DataPage extends Component {
  static propTypes = {
    media: PropTypes.string,
    match: PropTypes.object,
    isAirLayer: PropTypes.bool,
    airSensor: PropTypes.object,
    visualSensor: PropTypes.object,
    mapCentre: PropTypes.object,
    
    changeLayer: PropTypes.func,
    changeCentre: PropTypes.func,
    getAirDataLive: PropTypes.func,
    getVisualDataLive: PropTypes.func
  }

  // After component mounted, change map centre to the new position,
  // then fetch live data of sensors
  componentDidMount = () => {
    let { 
      isAirLayer,
      match,
      getAirDataLive,
      getVisualDataLive,
      changeCentre
    } = this.props

    let lng = parseFloat(match.params.long)
    let lat = parseFloat(match.params.lat)
    changeCentre({ lng, lat })

    if (isAirLayer)
      getAirDataLive({ lng, lat })
    else getVisualDataLive({lng, lat})
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
    let { airSensor, visualSensor } = this.props

    if (this.props.media === DESK)
      return (
        <div className={styles.outer}>
          <div className={styles.appbar}>
            <AppBar media={this.props.media} />
          </div>
          <div className={styles.content}>
            <div className={styles.data}>
              <ArrowLeftIcon className={styles.backButton} onClick={this.handleBackClick}/>
              <div className={styles.titleCard}>
                {/* TODO: render TitleCard dynamically based on props.airSensor (or visualSensor)*/}
                <TitleCard
                  name='Name not found.'
                  suburb='No location data'
                  position={{
                    long: this.props.mapCentre.lng,
                    lat: this.props.mapCentre.lat
                  }}
                />
              </div>
              <h3>Live feed</h3>
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
            </div>
            <div className={styles.mapContainer}>
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
          </div>
        </div>
      );
    else if (this.props.media === MOBILE)
      return (
        <div>

        </div>
      )
  }
}

const mapStateToProps = state => ({
  isAirLayer: state.map.isAirLayer,
  airSensor: state.sensor.air,
  visualSensor: state.sensor.visual,
  mapCentre: state.map.centre
})

const mapDispatchToProps = {
  changeLayer,
  changeCentre,
  getAirDataLive,
  getVisualDataLive
}

export default connect(mapStateToProps, mapDispatchToProps)(DataPage)