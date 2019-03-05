import React, { Component } from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import Map from '../../components/map/Map'
import { AppBar } from '../../components/appbar/AppBar'
import { DESK, MOBILE } from '../../../utils/const'
import styles from './Dashboard_desktop.module.scss'
import m_styles from './Dashboard_mobile.module.scss'
import { LayersBttn, LegendsBttn, CompareBttn } from '../../components/mapControl/ControlBttns/ControlBttns'

class DashboardMain extends Component {
  static propTypes = {
    layers: propTypes.array,
    media: propTypes.string
  }

  handleCompareClick = (e) => {
    e.preventDefault()
    this.props.history.push(`/compare`)
  }

  render() {
    if (this.props.media === DESK)
      return (
        <div className={ styles.outer }>
          <div className={ styles.appbar }>
            <AppBar active="dashboard" media={this.props.media}/>
          </div>
          <div className={ styles.mapContainer }>
            <Map media={this.props.media} zoomLevel={13}/>
            <div className={styles.controlButton}>
              <div>
                <LayersBttn media={this.props.media}/>
              </div>
              <div>
                <LegendsBttn media={this.props.media} />
              </div>
              <div onClick={this.handleCompareClick}>
                <CompareBttn media={this.props.media} />
              </div>
            </div>
          </div>
        </div>
      )
    else if (this.props.media === MOBILE)
      return (
        <div className={ m_styles.outer }>
          <div className={ m_styles.mapContainer }>
            <Map media={this.props.media} zoomLevel={13}/>
            <div>
              <div>
                <LayersBttn />
              </div>
            </div>
            <div className={m_styles.controlButton}>
              <div onClick={this.handleCompareClick}>
                <CompareBttn media={this.props.media} />
              </div>
              <div>
                <LegendsBttn media={this.props.media} />
              </div>
            </div>
          </div>
          <div className={ m_styles.appbar }>
            <AppBar  active="dashboard" media={this.props.media} />
          </div>
        </div>
      )
  }
}

const mapDispatchToProps = {}

export default connect(null, mapDispatchToProps)(DashboardMain)