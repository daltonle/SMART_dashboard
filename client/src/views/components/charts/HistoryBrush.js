import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { changeZoomDomain } from '../../../state/ducks/charts/actions'
import { getAirDataHistory, getVisualDataHistory } from '../../../state/ducks/sensor/actions'
import moment from 'moment'
import { VictoryGroup, VictoryLine, VictoryChart, VictoryAxis, VictoryBrushContainer } from 'victory'
import withDimension from 'react-dimensions'
import { MyVictoryTheme } from '../../../utils/victoryTheme'
import styles from './HistoryBrush.module.scss'

class HistoryChart extends Component {
  static propTypes = {
    airSensor: PropTypes.object,
    visualSensor: PropTypes.object,
    zoomDomain: PropTypes.object,

    changeZoomDomain: PropTypes.func
  }

  componentDidMount = () => {
    let { airSensor, visualSensor } = this.props
    if (airSensor !== undefined)
      this.props.getAirDataHistory(airSensor.id)
    if (visualSensor !== undefined)
      this.props.getVisualDataHistory(visualSensor.id)
  }

  handleZoomDomainChanged = (domain) => {
    this.props.changeZoomDomain(domain)
  }

  render() {
    const { containerHeight, containerWidth, airSensor, visualSensor } = this.props
    // pre-process data
    let airData=[],
        visualDataPedestrians=[]
    if (airSensor !== undefined) {
      if (airSensor.history !== undefined)
        airData = airSensor.history.map(data => ({
          ...data,
          timestamp: moment(data.timestamp, 'DD-MM-YYYY HH:mm:ss').toDate()
        }))
    }
    if (visualSensor !== undefined) {
      if (visualSensor.history !== undefined) {
        let tmp = visualSensor.history.filter(data => data.type === 'pedestrian')
        visualDataPedestrians = tmp.map(data => ({
          ...data,
          timestamp: moment(data.timestamp, 'DD-MM-YYYY HH:mm:ss').toDate()
        }))
      }
    }

    return (
      <VictoryChart
        theme={MyVictoryTheme}
        height={containerHeight}
        width={containerWidth}
        padding={{left: 80, right: 100, top: 40, bottom: 80}}
        scale={{ x: "time" }}
        domainPadding={{y: [20,0]}}
        containerComponent={
          <VictoryBrushContainer
            brushDimension="x"
            brushDomain={this.props.zoomDomain}
            onBrushDomainChange={this.handleZoomDomainChanged}
          />
        }
      >
        <VictoryAxis
          tickFormat={(x) => new Date(x).getFullYear()}
          scale="time"
        />
        <VictoryGroup
          style={{
            data: {
              strokeWidth: `3px`
            }
          }}
        >
          
          <VictoryLine
            interpolation="catmullRom"
            style={{
              data: {
                fill: `#02A27F`
              }
            }}
            data={airData}
            x="timestamp"
            y={d => parseFloat(d.pm2_5)}
          />
          <VictoryLine
            interpolation="catmullRom"
            style={{
              data: {
                fill: `#FFCA3A`
              }
            }}
            data={visualDataPedestrians}
            x="timestamp"
            y={d => parseInt(d.counter)}
          />
        </VictoryGroup>
      </VictoryChart>
    )
  }
}

const mapStateToProps = (state) => ({
  airSensor: state.sensor.air,
  visualSensor: state.sensor.visual,
  zoomDomain: state.charts.history.zoomDomain
})

const mapDispatchToProps = {
  getAirDataHistory,
  getVisualDataHistory,
  changeZoomDomain
}

export default withDimension({
  className: styles.wrapper
})(connect(mapStateToProps, mapDispatchToProps)(HistoryChart))