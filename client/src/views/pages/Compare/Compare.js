import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import classNames from 'classnames'
import ArrowLeftIcon from 'react-feather/dist/icons/arrow-left'
import ExitIcon from 'react-feather/dist/icons/x'
import { AppBar } from '../../components/appbar/AppBar'
import LocationPicker from '../../components/map/LocationPicker'
import { DESK, MOBILE } from '../../../utils/const'
import { LayersBttn, LegendsBttn, CompareBttn } from '../../components/mapControl/ControlBttns/ControlBttns'
import { HelpBttn } from '../../components/help-button/HelpBttn'
import CompareList from "../../components/compare-list/CompareList"
import { changeLayer } from '../../../state/ducks/map/actions'
import { removeAllSensors } from '../../../state/ducks/compare/actions'

import styles from "./Compare_desktop.module.scss"
import m_styles from "./Compare_mobile.module.scss"

class Compare extends Component {
  static propTypes = {
    count: PropTypes.number,
    media: PropTypes.string,
    
    changeLayer: PropTypes.func,
    removeAllSensors: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      doShowDetails: false
    }
  }

  handleBackClick = (e) => {
    e.preventDefault()
    this.props.history.push(`/dashboard`)
  }

  handleLayerClick = (e) => {
    e.preventDefault()
    this.props.changeLayer()
    this.props.removeAllSensors()
  }

  handleCompareClick = (e) => {
    e.preventDefault()
    this.props.history.push(`/dashboard`)
  }

  handleStartCompare = (e) => {
    e.preventDefault()
    this.setState({ doShowDetails: true })
  }

  handleCollapse = (e) => {
    e.preventDefault()
    this.setState({ doShowDetails: false })
  }

  render() {
    const { doShowDetails } = this.state

    if (this.props.media === DESK)
      return (
        <div className={styles.outer}>
          <div className={styles.appbar}>
            <AppBar media={this.props.media} />
          </div>
          <div className={styles.content}>
            <div className={classNames(styles.data, { [styles.detailsShown]: doShowDetails })}>
              <div className={styles.header} >
                <ArrowLeftIcon className={styles.backButton} onClick={this.handleBackClick}/>
                <h3>Compare</h3>
              </div>
              <h5>Choose location from map</h5>
              <CompareList />
              {
                this.props.count > 1 ?
                <div className={styles.start} onClick={this.handleStartCompare}>
                  <h3>Compare</h3>
                </div> :
                <div className={styles.startDisabled} >
                  <h3>Compare</h3>
                </div>
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
              </div> :
              <div className={styles.mapContainer}>
                <LocationPicker media={this.props.media}/>
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
      )
    else if (this.props.media === MOBILE)
      return (
        <div className={ m_styles.outer }>
          { doShowDetails ? 
          <div className={m_styles.chartDetails}>
            <div className={m_styles.backButton} onClick={this.handleBackClick}>
              <ArrowLeftIcon className={m_styles.icon} />
            </div>
            <h4>Live feed</h4>
            <div className={m_styles.header} style={{marginTop: 0}}>
              <h3>History</h3>
              <HelpBttn 
                name="history-chart" 
                message="Data collected over time" 
              />
            </div>
          </div> :
          <div className={m_styles.content}>
            <div className={ m_styles.mapContainer }>
              <LocationPicker media={this.props.media}/>
              <div className={m_styles.backButton} onClick={this.handleBackClick}>
                <ArrowLeftIcon className={m_styles.icon} />
              </div>
              <div className={m_styles.layerButton} onClick={this.handleLayerClick}>
                <LayersBttn media={this.props.media}/>
              </div>
            </div>
            <div className={m_styles.data}>
              <h4>Live feed</h4>
            </div>
          </div>
          }
          
          <div className={ m_styles.appbar }>
            <AppBar media={this.props.media} />
          </div>
        </div>
      )
  }
}

const mapStateToProps = state => ({
  count: state.compare.count
})

const mapDispatchToProps = {
  changeLayer,
  removeAllSensors
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Compare)
