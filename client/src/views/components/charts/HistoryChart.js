import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Plot from 'react-plotly.js'
import Downsampler from 'downsample-lttb'
import { getAirDataHistory, getVisualDataHistory } from '../../../state/ducks/sensor/actions'
import moment from 'moment'
import withDimension from 'react-dimensions'
import { colors } from '../../../styles/colors.js'
import styles from './HistoryChart.module.scss'
import '../../../styles/plotly.scss'

const numPointsInDownsampledData = 1000

class HistoryChart extends Component {
  static propTypes = {
    airSensor: PropTypes.object,
    visualSensor: PropTypes.object
  }

  componentDidMount = () => {
    let { airSensor, visualSensor } = this.props
    if (airSensor !== undefined)
      this.props.getAirDataHistory(airSensor.id)
    if (visualSensor !== undefined)
      this.props.getVisualDataHistory(visualSensor.id)
  }

  render() {
    const { containerHeight, containerWidth, airSensor, visualSensor } = this.props
    // pre-process data
    let airData = {
      pm2_5: { x:[], y:[] },
      pm10: { x:[], y:[] }
    }
    let visualData = {
      pedestrian: { x:[], y:[] },
      bicycle: { x:[], y:[] },
      vehicle: { x:[], y:[] }
    }

    if (airSensor !== undefined) {
      if (airSensor.history !== undefined) {
        let tmp2_5 = []
        let tmp10 = []

        airSensor.history.forEach(d => {
          tmp2_5.push([moment(d.timestamp, 'DD-MM-YYYY HH:mm:ss').toDate(), parseFloat(d.pm2_5)])
          tmp10.push([moment(d.timestamp, 'DD-MM-YYYY HH:mm:ss').toDate(), parseFloat(d.pm10)])
        })
        let downsampledPM2_5 = Downsampler.processData(tmp2_5, numPointsInDownsampledData)
        let downsampledPM10 = Downsampler.processData(tmp10, numPointsInDownsampledData)
        downsampledPM2_5.forEach(d => {
          airData.pm2_5.x.push(d[0])
          airData.pm2_5.y.push(d[1])
        })
        downsampledPM10.forEach(d => {
          airData.pm10.x.push(d[0])
          airData.pm10.y.push(d[1])
        })
      }
    }
    if (visualSensor !== undefined) {
      if (visualSensor.history !== undefined) {
        let tmpPed = []
        let tmpBi = []
        let tmpVeh = []

        visualSensor.history.forEach(d => {
          if (d.type === 'pedestrian')
            tmpPed.push([moment(d.timestamp, 'DD-MM-YYYY HH:mm:ss').toDate(), parseFloat(d.counter)])
          else if (d.type === 'bicycle')
            tmpBi.push([moment(d.timestamp, 'DD-MM-YYYY HH:mm:ss').toDate(), parseFloat(d.counter)])
          else if (d.type === 'vehicle')
            tmpVeh.push([moment(d.timestamp, 'DD-MM-YYYY HH:mm:ss').toDate(), parseFloat(d.counter)])
        })
        let downsampledPed = Downsampler.processData(tmpPed, numPointsInDownsampledData)
        let downsampledBi = Downsampler.processData(tmpBi, numPointsInDownsampledData)
        let downsampledVeh = Downsampler.processData(tmpVeh, numPointsInDownsampledData)
        downsampledPed.forEach(d => {
          visualData.pedestrian.x.push(d[0])
          visualData.pedestrian.y.push(d[1])
        })
        downsampledBi.forEach(d => {
          visualData.bicycle.x.push(d[0])
          visualData.bicycle.y.push(d[1])
        })
        downsampledVeh.forEach(d => {
          visualData.vehicle.x.push(d[0])
          visualData.vehicle.y.push(d[1])
        })
      }
    }

    return (
      <Plot
        data={[
          {
            x: airData.pm2_5.x,
            y: airData.pm2_5.y,
            name: "PM2_5",
            type: 'scatter',
            mode: 'markers',
            marker: { color: colors.green, opacity: 0.7 }
          },
          {
            x: airData.pm10.x,
            y: airData.pm10.y,
            name: "PM10",
            type: 'scatter',
            mode: 'markers',
            marker: { color: colors.red, opacity: 0.7 }
          },
          {
            x: visualData.pedestrian.x,
            y: visualData.pedestrian.y,
            name: "Pedestrian",
            type: "scatter",
            mode: "markers",
            marker: { color: colors.yellow, opacity: 0.7 }
          },
          {
            x: visualData.bicycle.x,
            y: visualData.bicycle.y,
            name: "Bicycle",
            type: "scatter",
            mode: "markers",
            marker: { color: colors.orange, opacity: 0.7 }
          },
          {
            x: visualData.vehicle.x,
            y: visualData.vehicle.y,
            name: "Others",
            type: "scatter",
            mode: "markers",
            marker: { color: colors.purple, opacity: 0.7 }
          }
        ]}
        config={{
          modeBarButtonsToRemove: ['toImage', 'sendDataToCloud', 'select2d', 'lasso2d', 'toggleSpikelines'],
          displaylogo: false,
        }}
        layout={{ 
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
        }}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  airSensor: state.sensor.air,
  visualSensor: state.sensor.visual
})

const mapDispatchToProps = {
  getAirDataHistory,
  getVisualDataHistory
}

export default withDimension({
  className: styles.wrapper
})(connect(mapStateToProps, mapDispatchToProps)(HistoryChart))