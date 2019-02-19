import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getAirDataHistory, getVisualDataHistory } from '../../../state/ducks/sensor/actions'
import { changeZoomDomain } from '../../../state/ducks/charts/actions'
import { VictoryGroup, VictoryArea, VictoryChart, VictoryLegend, VictoryAxis, VictoryZoomContainer } from 'victory'
import moment from 'moment'
import withDimension from 'react-dimensions'
import { MyVictoryTheme } from '../../../utils/victoryTheme'
import styles from './HistoryChart.module.scss'

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
        visualDataPedestrians=[],
        visualDataBicycle=[],
        visualDataOthers=[]
    if (airSensor !== undefined) {
      if (airSensor.history !== undefined)
        airData = airSensor.history.map(data => ({
          ...data,
          timestamp: moment(data.timestamp, 'DD-MM-YYYY HH:mm:ss').toDate()
        }))
    }
    if (visualSensor !== undefined) {
      if (visualSensor.history !== undefined) {
        let tmp = visualSensor.history.map(data => ({
          ...data,
          timestamp: moment(data.timestamp, 'DD-MM-YYYY HH:mm:ss').toDate()
        }))
        visualDataPedestrians = tmp.filter(data => data.type === 'pedestrian')
        visualDataBicycle = tmp.filter(data => data.type === 'bicycle')
        visualDataOthers = tmp.filter(data => data.type === 'vehicle')
      }
    }

    return (
      <VictoryChart
        theme={MyVictoryTheme}
        height={containerHeight}
        width={containerWidth}
        padding={{left: 80, right: 100, top: 40, bottom: 80}}
        domainPadding={{y: [20,0]}}
        scale={{ x: "time" }}
        containerComponent={
          <VictoryZoomContainer
            zoomDimension="x"
            zoomDomain={this.props.zoomDomain}
            onZoomDomainChange={this.handleZoomDomainChanged}
          />
        }
      >
        <VictoryAxis scale="time" />
        <VictoryAxis dependentAxis />
        <VictoryGroup
          style={{
            data: {
              strokeWidth: `3px`,
              fillOpacity: 0.1
            }
          }}
        >
          
          <VictoryArea
            interpolation="linear"
            style={{
              data: {
                fill: `#02A27F`,
                stroke: `#02A27F`
              }
            }}
            data={airData}
            x="timestamp"
            y={d => parseFloat(d.pm2_5)}
          />
          <VictoryArea
            interpolation="linear"
            style={{
              data: {
                fill: `#FF595E`,
                stroke: `#FF595E`
              }
            }}
            data={airData}
            x="timestamp"
            y={d => parseFloat(d.pm10)}
          />
          <VictoryArea
            interpolation="catmullRom"
            style={{
              data: {
                fill: `#FFCA3A`,
                stroke: `#FFCA3A`
              }
            }}
            data={visualDataPedestrians}
            x="timestamp"
            y={d => parseInt(d.counter)}
          />
          <VictoryArea
            interpolation="catmullRom"
            style={{
              data: {
                fill: `#E66337`,
                stroke: `#E66337`
              }
            }}
            data={visualDataBicycle}
            x="timestamp"
            y={d => parseInt(d.counter)}
          />
          <VictoryArea
            interpolation="catmullRom"
            style={{
              data: {
                fill: `#5E50B5`,
                stroke: `#5E50B5`
              }
            }}
            data={visualDataOthers}
            x="timestamp"
            y={d => parseInt(d.counter)}
          />
        </VictoryGroup>
        <VictoryLegend
          x={56}
          theme={MyVictoryTheme}
          padding={{left: 40, bottom: 24, top: 0, right: 0}}
          data={[
            ...airData.length=== 0 ? [] : [{ name: "PM2.5", symbol: {fill: "#02A27F"} }, { name: "PM10", symbol: {fill: "#FF595E"} }],
            ...visualDataBicycle.length===0 ? [] : [ { name: "Pedestrian", symbol: {fill: "#FFCA3A"} }, { name: "Bicycle", symbol: {fill: "#E66337"} }, { name: "Others", symbol: {fill: "#5E50B5"} }]       
          ]}
        />
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