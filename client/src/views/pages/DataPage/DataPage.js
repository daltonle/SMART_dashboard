import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { DESK, MOBILE } from '../../../utils/const';
import { AppBar } from '../../components/appbar/AppBar';
import Map from '../../components/map/Map';
import { CompareBttn, LayersBttn, LegendsBttn } from '../../components/mapControl/ControlBttns/ControlBttns';
import { changeLayer } from '../../../state/ducks/map/actions'
import styles from './DataPage_desktop.module.scss';


class DataPage extends Component {
  static propTypes = {
    media: PropTypes.string,
    match: PropTypes.object
  }

  handleLayerClick = (e) => {
    e.preventDefault()
    this.props.changeLayer()
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

const mapDispatchToProps = {
  changeLayer
}

export default connect(null, mapDispatchToProps)(DataPage)