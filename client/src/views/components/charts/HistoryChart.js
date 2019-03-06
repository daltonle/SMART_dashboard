import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Plot from 'react-plotly.js'
import moment from 'moment'
import withDimension from 'react-dimensions'
import { MOBILE } from '../../../utils/const'
import { colors } from '../../../styles/colors.js'
import styles from './HistoryChart.module.scss'
import '../../../styles/plotly.scss'

class HistoryChart extends Component {
  static propTypes = {
    media: PropTypes.string,
    airSensor: PropTypes.object,
    visualSensor: PropTypes.object
  }

  render() {
    const { containerHeight, containerWidth, airSensor, visualSensor, history } = this.props
    let sensorType = undefined
    if (history.location.state) {
      sensorType = history.location.state.type
    }

    // pre-process data
    let dataPM2_5 = { x:[], y:[] }
    let dataPM10 = { x:[], y:[] }
    let dataPedestrian = { x:[], y:[] }
    let dataBicycle = { x:[], y:[] }
    let dataVehicle = { x:[], y:[] }

    if (sensorType === 'air' && airSensor !== undefined) {
      if (airSensor.historyPM2_5) {
        for (let i = 0, l = airSensor.historyPM2_5.length; i < l; i++) {
          dataPM2_5.x.push(moment(airSensor.historyPM2_5[i].x, "DD-MM-YYYY HH:mm:ss").toDate())
          dataPM2_5.y.push(airSensor.historyPM2_5[i].y)
        }
      }
      if (airSensor.historyPM10) {
        for (let i = 0, l = airSensor.historyPM10.length; i < l; i++) {
          dataPM10.x.push(moment(airSensor.historyPM10[i].x, "DD-MM-YYYY HH:mm:ss").toDate())
          dataPM10.y.push(airSensor.historyPM10[i].y)
        }
      }
    }
    if (sensorType === 'visual' && visualSensor !== undefined) {
      if (visualSensor.historyPedestrian) {
        for (let i = 0, l = visualSensor.historyPedestrian.length; i < l; i++) {
          dataPedestrian.x.push(moment(visualSensor.historyPedestrian[i].x, "DD-MM-YYYY HH:mm:ss").toDate())
          dataPedestrian.y.push(visualSensor.historyPedestrian[i].y)
        }
      }
      if (visualSensor.historyBicycle) {
        for (let i = 0, l = visualSensor.historyBicycle.length; i < l; i++) {
          dataBicycle.x.push(moment(visualSensor.historyBicycle[i].x, "DD-MM-YYYY HH:mm:ss").toDate())
          dataBicycle.y.push(visualSensor.historyBicycle[i].y)
        }
      }
      if (visualSensor.historyVehicle) {
        for (let i = 0, l = visualSensor.historyVehicle.length; i < l; i++) {
          dataVehicle.x.push(moment(visualSensor.historyVehicle[i].x, "DD-MM-YYYY HH:mm:ss").toDate())
          dataVehicle.y.push(visualSensor.historyVehicle[i].y)
        }
      }
    }

    // chart layout
    const webLayout = { 
      width: containerWidth, 
      height: containerHeight,
      showlegend: true,
      legend: { x: 0, y: 1.25, orientation: "h" },
      plot_bgcolor: colors.backgroundColor,
      paper_bgcolor: colors.backgroundColor,
      margin: {
        t: 0,
        pad: 8
      }
    }
    
    const mobileLayout = {
      ...webLayout,
      margin: {
        t: 100,
        l: 40,
        r: 0,
        b: 64,
        pad: 8
      }
    }

    // chart config
    const webConfig = {
      modeBarButtonsToRemove: ['toImage', 'sendDataToCloud', 'select2d', 'lasso2d', 'toggleSpikelines'],
      displaylogo: false,
      displayModeBar: 'hover'
    }

    const mobileCongig = {
      ...webConfig,
      displayModeBar: true
    }

    return (
      <Plot
        data={[
          {
            ...dataPM2_5,
            name: "PM2_5",
            type: 'scatter',
            mode: 'lines',
            marker: { color: colors.green, opacity: 0.7 }
          },
          {
            ...dataPM10,
            name: "PM10",
            type: 'scatter',
            mode: 'lines',
            marker: { color: colors.red, opacity: 0.7 }
          },
          {
            ...dataPedestrian,
            name: "Pedestrian",
            type: "scatter",
            mode: "lines",
            marker: { color: colors.yellow, opacity: 0.7 }
          },
          {
            ...dataBicycle,
            name: "Bicycle",
            type: "scatter",
            mode: "lines",
            marker: { color: colors.orange, opacity: 0.7 }
          },
          {
            ...dataVehicle,
            name: "Vehicles",
            type: "scatter",
            mode: "lines",
            marker: { color: colors.purple, opacity: 0.7 }
          }
        ]}
        config={this.props.media===MOBILE ? mobileCongig : webConfig}
        layout={this.props.media===MOBILE ? mobileLayout : webLayout}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  airSensor: state.sensor.air,
  visualSensor: state.sensor.visual
})

const mapDispatchToProps = {}

export default withDimension({
  className: styles.wrapper
})(connect(mapStateToProps, mapDispatchToProps)(HistoryChart))