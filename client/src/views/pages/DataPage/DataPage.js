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
                <TitleCard
                  name='Name not found.'
                  suburb='No location data'
                  position={{
                    long: this.props.mapCentre.lng,
                    lat: this.props.mapCentre.lat
                  }}
                />
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