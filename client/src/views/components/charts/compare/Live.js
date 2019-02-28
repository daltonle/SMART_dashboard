import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Plot from 'react-plotly.js'
import withDimension from 'react-dimensions'
import { MOBILE } from '../../../../utils/const'
import { colors } from '../../../../styles/colors.js'
import styles from './Live.module.scss'
import '../../../../styles/plotly.scss'

class Live extends Component {
  static propTypes = {
    media: PropTypes.string,
    isAirLayer: PropTypes.bool,
    sensors: PropTypes.array
  }

  render() {
    const { containerHeight, containerWidth, sensors, isAirLayer } = this.props
    // pre-process data
    let dataPM2_5 = { x:[], y:[] }
    let dataPM10 = { x:[], y:[] }
    let dataPedestrian = { x:[], y:[] }
    let dataBicycle = { x:[], y:[] }
    let dataVehicle = { x:[], y:[] }

    if (isAirLayer) {
      for (let i = 0, l = sensors.length; i < l; i++) {
        dataPM2_5.x.push(`${sensors[i].description.substr(0,25)}...`)
        dataPM10.x.push(`${sensors[i].description.substr(0,25)}...`)
        dataPM2_5.y.push(sensors[i].pm2_5)
        dataPM10.y.push(sensors[i].pm10)
      }
    }
    else {
      for (let i = 0, l = sensors.length; i < l; i++) {
        dataPedestrian.x.push(`${sensors[i].description.substr(0,25)}...`)
        dataBicycle.x.push(`${sensors[i].description.substr(0,25)}...`)
        dataVehicle.x.push(`${sensors[i].description.substr(0,25)}...`)
        dataPedestrian.y.push(sensors[i].pedestrians)
        dataBicycle.y.push(sensors[i].bicycles)
        dataVehicle.y.push(sensors[i].vehicles)
      }
    }

    // chart layout
    const webLayout = { 
      width: containerWidth, 
      height: containerHeight,
      barmode: 'group',
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
            name: 'PM2.5',
            type: 'bar',
            marker: { color: colors.green, opacity: 0.7 }
          },
          {
            ...dataPM10,
            name: 'PM10',
            type: 'bar',
            marker: { color: colors.red, opacity: 0.7 }
          },
          {
            ...dataPedestrian,
            name: 'Pedestrian',
            type: 'bar',
            marker: { color: colors.yellow, opacity: 0.7 }
          },
          {
            ...dataBicycle,
            name: 'Bicycle',
            type: 'bar',
            marker: { color: colors.purple, opacity: 0.7 }
          },
          {
            ...dataVehicle,
            name: 'Vehicle',
            type: 'bar',
            marker: { color: colors.maroon, opacity: 0.7 }
          }
        ]}
        config={this.props.media===MOBILE ? mobileCongig : webConfig}
        layout={this.props.media===MOBILE ? mobileLayout : webLayout}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  isAirLayer: state.map.isAirLayer,
  sensors: state.compare.sensors
})

const mapDispatchToProps = {}

export default withDimension({
  className: styles.wrapper
})(connect(mapStateToProps, mapDispatchToProps)(Live))