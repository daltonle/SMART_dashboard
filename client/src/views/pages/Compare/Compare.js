import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import classNames from 'classnames'
import ArrowLeftIcon from 'react-feather/dist/icons/arrow-left'
import ExitIcon from 'react-feather/dist/icons/x'
import LeftIcon from 'react-feather/dist/icons/chevron-left'
import RightIcon from 'react-feather/dist/icons/chevron-right'
import DownIcon from 'react-feather/dist/icons/chevron-down'
import UpIcon from 'react-feather/dist/icons/chevron-up'
import Select from 'react-select'
import { AppBar } from '../../components/appbar/AppBar'
import LocationPicker from '../../components/map/LocationPicker'
import { LocationCard } from '../../components/map/LocationCard'
import { DESK, MOBILE } from '../../../utils/const'
import { LayersBttn, LegendsBttn, CompareBttn } from '../../components/mapControl/ControlBttns/ControlBttns'
import { HelpBttn } from '../../components/help-button/HelpBttn'
import CompareList from "../../components/compare-list/CompareList"
import Live from "../../components/charts/compare/Live"
import History from "../../components/charts/compare/History"
import ByHour from "../../components/charts/compare/ByHour"
import { colors } from "../../../styles/colors"
import { changeLayer } from '../../../state/ducks/map/actions'
import { removeAllSensors } from '../../../state/ducks/compare/actions'

import styles from "./Compare_desktop.module.scss"
import m_styles from "./Compare_mobile.module.scss"

class Compare extends Component {
  static propTypes = {
    count: PropTypes.number,
    media: PropTypes.string,
    isAirLayer: PropTypes.bool,
    
    changeLayer: PropTypes.func,
    removeAllSensors: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      doShowDetails: false,
      day: 0,
      type: 'avg',

      doShowCompareListMobile: false,
      historyType: props.isAirLayer ? 'pm2_5' : 'pedestrian'
    }
  }

  handleBackClick = (e) => {
    e.preventDefault()
    this.props.removeAllSensors()
    this.props.history.push(`/dashboard`)
  }

  handleLayerClick = (e) => {
    e.preventDefault()
    const { isAirLayer } = this.props
    this.props.changeLayer()
    this.props.removeAllSensors()
    this.setState({ historyType: isAirLayer ? "pedestrian" : "pm2_5"})
  }

  handleCompareClick = (e) => {
    e.preventDefault()
    this.props.removeAllSensors()
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

  handleDayDecreased = (e) => {
    e.preventDefault()
    const { day } = this.state
    let newDay = (day===0 ? 6 : day-1)
    this.setState({
      day: newDay
    })
  }

  handleDayIncreased = (e) => {
    e.preventDefault()
    const { day } = this.state
    let newDay = (day===6 ? 0 : day+1)
    this.setState({
      day: newDay
    })
  }

  handleTypeChanged = (selected) => {
    this.setState({ type: selected.value })
  }

  handleShowCompareList = (e) => {
    e.preventDefault()
    this.setState({
      doShowCompareListMobile: true
    })
  }

  handleHideCompareList = (e) => {
    e.preventDefault()
    this.setState({
      doShowCompareListMobile: false
    })
  }

  render() {
    const { doShowDetails, day, type, doShowCompareListMobile, historyType } = this.state
    const { isAirLayer, count } = this.props
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

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
              <CompareList media={DESK}/>
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
                  <h3>Live data</h3>
                  <HelpBttn 
                    name="live-compare" 
                    message="Live data across locations" 
                  />
                </div>
                <Live media={this.props.media}/>
                <div className={styles.header} style={{marginTop: 0}}>
                  <h3>History</h3>
                  <HelpBttn 
                    name="history-compare" 
                    message="Data recorded over time across locations" 
                  />
                </div>
                {
                  isAirLayer ?
                  <div className={styles.chartGroup}>
                    <div className={styles.chartItemAir}>
                      <h4>PM2.5</h4>
                      <History field="pm2_5" media={this.props.media}/>
                    </div>
                    <div className={styles.chartItemAir}>
                      <h4>PM10</h4>
                      <History field="pm10" media={this.props.media}/>
                    </div>
                  </div> :
                  <div className={styles.chartGroup}>
                    <div className={styles.chartItemVisual}>
                      <h4>Pedestrian</h4>
                      <History field="pedestrian" media={this.props.media}/>
                    </div>
                    <div className={styles.chartItemVisual}>
                      <h4>Bicycle</h4>
                      <History field="bicycle" media={this.props.media}/>
                    </div>
                    <div className={styles.chartItemVisual}>
                      <h4>Others</h4>
                      <History field="vehicle" media={this.props.media}/>
                    </div>
                  </div>
                }
                <div className={styles.header} style={{marginTop: 0}}>
                  <h3>Data by hour</h3>
                  <HelpBttn 
                    name="by-hour-compare" 
                    message="Data recorded across locations during each hour each day" 
                  />
                </div>
                <div className={styles.options}>
                  <LeftIcon className={styles.icon} onClick={e => this.handleDayDecreased(e)}/>
                  <h5>{days[day]}</h5>
                  <RightIcon className={styles.icon} onClick={e => this.handleDayIncreased(e)}/>
                  <div className={styles.dropdown}>
                    <Select
                      defaultValue={{ value: `${type}`, label: type==="avg" ? "average" : (type==="min" ? "minimum" : "maximum") }}
                      onChange={this.handleTypeChanged}
                      options={[
                        { value: "avg", label: "average" },
                        { value: "min", label: "minimum" },
                        { value: "max", label: "maximum" }
                      ]}
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: `3px`,
                        colors: {
                          ...theme.colors,
                          primary25: colors.primaryColor_1,
                          primary50: colors.primaryColor_3,
                          primary: colors.primaryColor,
                        }
                      })}
                    />
                  </div>
                </div>
                {
                  isAirLayer ?
                  <div className={styles.chartGroup}>
                    <div className={styles.chartItemAir}>
                      <h4>PM2.5</h4>
                      <ByHour field="pm2_5" day={day} type={type} media={this.props.media}/>
                    </div>
                    <div className={styles.chartItemAir}>
                      <h4>PM10</h4>
                      <ByHour field="pm10" day={day} type={type} media={this.props.media}/>
                    </div>
                  </div> :
                  <div className={styles.chartGroup}>
                    <div className={styles.chartItemVisual}>
                      <h4>Pedestrian</h4>
                      <ByHour field="pedestrian" day={day} type={type} media={this.props.media}/>
                    </div>
                    <div className={styles.chartItemVisual}>
                      <h4>Bicycle</h4>
                      <ByHour field="bicycle" day={day} type={type} media={this.props.media}/>
                    </div>
                    <div className={styles.chartItemVisual}>
                      <h4>Others</h4>
                      <ByHour field="vehicle" day={day} type={type} media={this.props.media}/>
                    </div>
                  </div>
                }
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
          <div className={m_styles.title}> 
            <ArrowLeftIcon className={m_styles.icon} onClick={this.handleBackClick}/>
            <h5>{doShowDetails ? `Comparing ${count} locations` : "Choose location from map"}</h5>
            {this.state.doShowCompareListMobile ?
              <UpIcon className={m_styles.icon} onClick={this.handleHideCompareList}/> :
              <DownIcon className={m_styles.icon} onClick={this.handleShowCompareList}/>
            }
            { doShowCompareListMobile ? 
              <CompareList media={MOBILE} /> :
              <div style={{display: `none`}}></div>
            }
          </div>
          { doShowDetails ? 
            <div className={m_styles.chartDetails}>
              <div className={m_styles.exitButton} onClick={this.handleCollapse}>
                <ExitIcon className={m_styles.icon}/>
              </div>
              <div className={m_styles.header} style={{marginTop: 0}}>
                <h3>Live data</h3>
                <HelpBttn 
                  name="live-compare" 
                  message="Live data across locations" 
                />
              </div>
              <Live media={this.props.media}/>
              <div className={m_styles.header} style={{marginTop: 0}}>
                <h3>History</h3>
                <HelpBttn 
                  name="history-compare" 
                  message="Data recorded over time across locations" 
                />
              </div>
              {
                isAirLayer ?
                <div className={m_styles.historyChart}>
                  <div className={m_styles.options}>
                    <h5>Type</h5>
                    <div className={m_styles.dropdown}>
                      <Select
                        defaultValue={{ value: `${historyType}`, label: historyType==="pm2_5" ? "PM2.5" : "PM10" }}
                        onChange={(selected, e) => {this.setState({ historyType: selected.value })}}
                        options={[
                          { value: "pm2_5", label: "PM2.5" },
                          { value: "pm10", label: "PM10" }
                        ]}
                        theme={(theme) => ({
                          ...theme,
                          borderRadius: `3px`,
                          colors: {
                            ...theme.colors,
                            primary25: colors.primaryColor_1,
                            primary50: colors.primaryColor_3,
                            primary: colors.primaryColor,
                          }
                        })}
                      />
                    </div>
                  </div>
                  <History field={this.state.historyType} media={this.props.media}/>
                </div> :
                <div className={m_styles.historyChart}>
                  <div className={m_styles.options}>
                    <h5>Type</h5>
                    <div className={m_styles.dropdown}>
                      <Select
                        defaultValue={{ value: `${historyType}`, label: historyType==="pedestrian" ? "Pedestrian" : (historyType==="bicycle" ? "Bicycle" : "Others") }}
                        onChange={(selected, e) => {this.setState({ historyType: selected.value })}}
                        options={[
                          { value: "pedestrian", label: "Pedestrian" },
                          { value: "bicycle", label: "Bicycle" },
                          { value: "vehicle", label: "Others" }
                        ]}
                        theme={(theme) => ({
                          ...theme,
                          borderRadius: `3px`,
                          colors: {
                            ...theme.colors,
                            primary25: colors.primaryColor_1,
                            primary50: colors.primaryColor_3,
                            primary: colors.primaryColor,
                          }
                        })}
                      />
                    </div>
                  </div>
                  <History field={this.state.historyType} media={this.props.media}/>
                </div>
              }
            </div> :
            <div className={ m_styles.mapContainer }>
              <LocationPicker media={this.props.media}/>
              <div className={m_styles.layerButton} onClick={this.handleLayerClick}>
                <LayersBttn media={this.props.media}/>
              </div>
              
              {
                this.props.count > 1 ?
                <div className={m_styles.start} onClick={this.handleStartCompare}>
                  <h3>Compare</h3>
                </div> :
                <div className={m_styles.startDisabled} >
                  <h3>Compare</h3>
                </div>
              }
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
  count: state.compare.count,
  isAirLayer: state.map.isAirLayer
})

const mapDispatchToProps = {
  changeLayer,
  removeAllSensors
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Compare)
