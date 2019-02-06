import React, { Component } from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import Map from '../../components/map/Map'
import { AppBar } from '../../components/appbar/AppBar'
import { DESK, MOBILE } from '../../../utils/const'
import styles from './Dashboard_desktop.module.scss'
import m_styles from './Dashboard_mobile.module.scss'
import { LayersBttn, LegendsBttn, CompareBttn } from '../../components/mapControl/ControlBttns/ControlBttns'
import { changeLayer } from '../../../state/ducks/map/actions'

class DashboardMain extends Component {
  static propTypes = {
    media: propTypes.string,
    changeLayer: propTypes.func
  }

  handleLayerClick = (e) => {
    e.preventDefault()
    this.props.changeLayer()
  }

  render() {
    if (this.props.media === DESK)
      return (
        <div className={ styles.outer }>
          <div className={ styles.appbar }>
            <AppBar media={this.props.media}/>
          </div>
          <div className={ styles.mapContainer }>
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
      )
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

const mapDispatchToProps = {
  changeLayer
}

export default connect(null, mapDispatchToProps)(DashboardMain)