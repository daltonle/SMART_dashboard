import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Plot from 'react-plotly.js'
import { MOBILE } from '../../../utils/const'
import { colors } from '../../../styles/colors'
import withDimension from 'react-dimensions'
import styles from './VisualHeatmap.module.scss'

class VisualHeatmap extends Component {
  static propTypes = {
    media: PropTypes.string,
    id: PropTypes.string,
    data: PropTypes.array,
    reso_x: PropTypes.number,
    reso_y: PropTypes.number,

    getHeatmapData: PropTypes.func
  }

  render() {
    const { containerWidth, media, reso_x, reso_y } = this.props
    const customHeight = containerWidth / reso_x * reso_y

    const data = [
      {
      z: this.props.data,
      type: 'heatmap'
      }
    ]

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
      }
    }
    
    const mobileLayout = {
      ...webLayout,
      margin: {
        t: 40,
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
          data={data}
          layout={media===MOBILE ? mobileLayout : webLayout}
          config={media===MOBILE ? mobileConfig : webConfig}
          
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  id: state.sensor.visual.id,
  data: state.sensor.visual.heatmap,
  reso_x: state.sensor.visual.reso_x,
  reso_y: state.sensor.visual.reso_y
})

const mapDispatchToProps = {}

export default withDimension({
  className: styles.wrapper
})(connect(mapStateToProps, mapDispatchToProps)(VisualHeatmap))