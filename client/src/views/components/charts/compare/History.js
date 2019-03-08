import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Plot from 'react-plotly.js'
import withDimension from 'react-dimensions'
import moment from 'moment'
import { MOBILE } from '../../../../utils/const'
import { colors, colorScale } from '../../../../styles/colors.js'
import styles from './History.module.scss'
import '../../../../styles/plotly.scss'

class History extends Component {
  static propTypes = {
    media: PropTypes.string,
    sensors: PropTypes.array,
    field: PropTypes.string
  }

  render() {
    const { containerHeight, containerWidth, sensors, field } = this.props
    // pre-process data
    let chartData = []

    for (let i = 0, l = sensors.length; i < l; i++) {
      if (sensors[i].history) {
        let idx = chartData.push({
          x: [],
          y: [],
          name: `${sensors[i].description.substr(0,10)}...`,
          type: 'scatter',
          mode: 'markers',
          marker: { color: colorScale[i], opacity: 0.7 }
        }) - 1
        if (sensors[i].history[field]) {
          if (sensors[i].history[field].x) {
            sensors[i].history[field].x.forEach(d => {
              chartData[idx].x.push(moment(d, "DD-MM-YYYY HH:mm:ss").toDate())
            })
            chartData[idx].y = [...sensors[i].history[field].y]
          }
        }
      }
    }

    // chart layout
    const webLayout = { 
      width: containerWidth, 
      height: containerHeight,
      showlegend: true,
      legend: { x: 0, y: 1.3, orientation: "h" },
      plot_bgcolor: colors.backgroundColor,
      paper_bgcolor: colors.backgroundColor,
      margin: {
        t: 80,
        l: 40,
        r: 8,
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
        data={chartData}
        config={this.props.media===MOBILE ? mobileCongig : webConfig}
        layout={this.props.media===MOBILE ? mobileLayout : webLayout}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  sensors: state.compare.sensors
})

const mapDispatchToProps = {}

export default withDimension({
  className: styles.wrapper
})(connect(mapStateToProps, mapDispatchToProps)(History))