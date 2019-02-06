import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Map from '../../components/map/Map'
import { AppBar } from '../../components/appbar/AppBar'
import { DESK } from '../../../utils/const'
import styles from './Dashboard_desktop.module.scss'

export default class Dashboard_desktop extends Component {
  static propTypes = {
    
  }

  render() {
    return (
      <div className={ styles.outer }>
        <div className={ styles.appbar }>
          <AppBar media={ DESK }/>
        </div>
        <div className={ styles.mapContainer }>
          <Map />
        </div>
      </div>
    )
  }
}
