import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AppBar } from '../../components/appbar/AppBar';
import { MOBILE } from '../../../utils/const';
import styles from './Dashboard_mobile.module.scss'
import Map from '../../components/map/Map';


export default class Dashboard_mobile extends Component {
  static propTypes = {
    
  }

  render() {
    return (
      <div className={ styles.outer }>
        <div className={ styles.mapContainer }>
          <Map />
        </div>
        <div className={ styles.appbar }>
          <AppBar media={MOBILE} />
        </div>
      </div>
    )
  }
}
