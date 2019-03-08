import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Plot from 'react-plotly.js'
import withDimension from 'react-dimensions'
import { MOBILE } from '../../../utils/const'
import { colors } from '../../../styles/colors'
import styles from './VisualLiveChart.module.scss'

class VisualLiveChart extends Component {
  static propTypes = {
    sensor: PropTypes.object,
    media: PropTypes.string
  }

  render() {
    const { sensor, containerHeight, containerWidth, media } = this.props
    const data = [{
      x: [sensor.pedestrians, sensor.bicycles, sensor.vehicles],
      y: ['Pedestrian', 'Bicycle', 'Vehicle'],
      type: 'bar',
      orientation: 'h',
      marker: { color: colors.green, opacity: 0.7 }
    }]

    // chart layout
    const webLayout = { 
      width: containerWidth, 
      height: containerHeight,
      showlegend: false,
      legend: { x: 0, y: 1.25, orientation: "h" },
      plot_bgcolor: colors.backgroundColor,
      paper_bgcolor: colors.backgroundColor,
      margin: {
        t: 0,
        b:0,
        pad: 8
      }
    }
    
    const mobileLayout = {
      ...webLayout,
      margin: {
        t: 0,
        l: 40,
        r: 24,
        b: 0,
        pad: 8
      }
    }

    // chart config
    const webConfig = {
      modeBarButtonsToRemove: ['toImage', 'sendDataToCloud', 'select2d', 'lasso2d', 'toggleSpikelines'],
      displaylogo: false,
      displayModeBar: false
    }

    const mobileCongig = {
      ...webConfig,
      displayModeBar: true
    }

    return (
      <Plot
        data={data}
        layout={media===MOBILE ? mobileLayout : webLayout}
        config={media===MOBILE ? mobileCongig : webConfig}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  sensor: state.sensor.visual
})

const mapDispatchToProps = {
  
}

export default withDimension({
  className: styles.wrapper
})(connect(mapStateToProps, mapDispatchToProps)(VisualLiveChart))