import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Plot from 'react-plotly.js'
import { MOBILE } from '../../../utils/const'
import { colors } from '../../../styles/colors'
import withDimension from 'react-dimensions'
import styles from './TrajectoryChart.module.scss'

class TrajectoryChart extends Component {
  static propTypes = {
    media: PropTypes.string,
    id: PropTypes.string,
    data: PropTypes.array
  }

  shouldComponentUpdate = (prevProps) => {
    if (this.props.data !== prevProps.data)
      return true
  }

  render() {
    const WIDTH_RATIO = 1280
    const HEIGHT_RATIO = 720
    const { containerWidth, media, data } = this.props
    const customHeight = containerWidth / WIDTH_RATIO * HEIGHT_RATIO

    const chartData = []
    if (data !== undefined) {
      for (let i = 0, l = data.length; i < l; i++) {
        chartData.push({
          x: data[i].x,
          y: data[i].y,
          type: 'scatter',
          mode: 'lines'
        })
      }
    }

    // chart layout
    const webLayout = { 
      width: containerWidth, 
      height: customHeight,
      showlegend: true,
      legend: { x: 0, y: 1.25, orientation: "h" },
      plot_bgcolor: colors.backgroundColor,
      paper_bgcolor: colors.backgroundColor,
      margin: {
        t: 40,
        pad: 8
      },
      xaxis: {range: [0,1280]},
      yaxis: {range: [0,720]},
      showlegend: false
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

    const mobileConfig = {
      ...webConfig,
      displayModeBar: true
    }

    console.log(data)

    return(
      <div>
        <Plot
          data={chartData}
          layout={media===MOBILE ? mobileLayout : webLayout}
          config={media===MOBILE ? mobileConfig : webConfig}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  id: state.sensor.visual.id,
  data: state.sensor.visual.trajectory
})

const mapDispatchToProps = {}

export default withDimension({
  className: styles.wrapper
})(connect(mapStateToProps, mapDispatchToProps)(TrajectoryChart))