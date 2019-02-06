import React, { Component } from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import Map from '../../components/map/Map'
import { AppBar } from '../../components/appbar/AppBar'
import { DESK } from '../../../utils/const'
import styles from './Dashboard_desktop.module.scss'
import { LayersBttn, LegendsBttn } from '../../components/mapControl/ControlBttns/ControlBttns'
import { changeLayer } from '../../../state/ducks/map/actions'

class Dashboard_desktop extends Component {
  static propTypes = {
    changeLayer: propTypes.func
  }

  handleLayerClick = (e) => {
    e.preventDefault()
    this.props.changeLayer()
  }

  render() {
    return (
      <div className={ styles.outer }>
        <div className={ styles.appbar }>
          <AppBar media={ DESK }/>
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
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
  changeLayer
}

export default connect(null, mapDispatchToProps)(Dashboard_desktop)