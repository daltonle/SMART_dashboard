import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Plot from 'react-plotly.js'
import Downsampler from 'downsample-lttb'
import { getAirDataHistory, getVisualDataHistory } from '../../../state/ducks/sensor/actions'
import moment from 'moment'
import withDimension from 'react-dimensions'
import { MOBILE } from '../../../utils/const'
import { colors } from '../../../styles/colors.js'
import styles from './HistoryChart.module.scss'
import '../../../styles/plotly.scss'

const numPointsInDownsampledData = 500

class HistoryChart extends Component {
  static propTypes = {
    media: PropTypes.string,
    airSensor: PropTypes.object,
    visualSensor: PropTypes.object
  }

  componentDidMount = () => {
    let { airSensor, visualSensor } = this.props
    if (visualSensor !== undefined)
      this.props.getVisualDataHistory(visualSensor.id)
  }

  render() {
    const { containerHeight, containerWidth, airSensor, visualSensor } = this.props
    // pre-process data
    let dataPM2_5 = { x:[], y:[] }
    let dataPM10 = { x:[], y:[] }
    let visualData = {
      pedestrian: { x:[], y:[] },
      bicycle: { x:[], y:[] },
      vehicle: { x:[], y:[] }
    }

    if (airSensor !== undefined) {
      if (airSensor.historyPM2_5 !== undefined) {
        for (let i = 0, l = airSensor.historyPM2_5.length; i < l; i++) {
          dataPM2_5.x.push(moment(airSensor.historyPM2_5[i].x, "DD-MM-YYYY HH:mm:ss").toDate())
          dataPM2_5.y.push(airSensor.historyPM2_5[i].y)
        }
      }
      if (airSensor.historyPM10 !== undefined) {
        for (let i = 0, l = airSensor.historyPM10.length; i < l; i++) {
          dataPM10.x.push(moment(airSensor.historyPM10[i].x, "DD-MM-YYYY HH:mm:ss").toDate())
          dataPM10.y.push(airSensor.historyPM10[i].y)
        }
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
            mode: 'markers',
            marker: { color: colors.green, opacity: 0.7 }
          },
          {
            ...dataPM10,
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

const mapDispatchToProps = {
  getAirDataHistory,
  getVisualDataHistory
}

export default withDimension({
  className: styles.wrapper
})(connect(mapStateToProps, mapDispatchToProps)(HistoryChart))