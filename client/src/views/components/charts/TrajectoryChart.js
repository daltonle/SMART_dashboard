import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Plot from 'react-plotly.js'
import { MOBILE } from '../../../utils/const'
import { colors } from '../../../styles/colors'
import withDimension from 'react-dimensions'
import { getTrajectoryData } from '../../../state/ducks/sensor/actions'
import styles from './TrajectoryChart.module.scss'

class TrajectoryChart extends Component {
  static propTypes = {
    media: PropTypes.string,
    id: PropTypes.string,
    trajectory: PropTypes.object,
    reso_x: PropTypes.string,
    reso_y: PropTypes.string,
    analysisPeriod: PropTypes.object,

    getTrajectoryData: PropTypes.func
  }

  shouldComponentUpdate = (nextProps) => {
    if (this.props.trajectory !== nextProps.trajectory || this.props.analysisPeriod !== nextProps.analysisPeriod)
      return true
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.analysisPeriod !== prevProps.analysisPeriod) {
      this.props.getTrajectoryData(this.props.id)
      this.forceUpdate()
    }
  }


  render() {
    const { containerWidth, media, reso_x, reso_y, trajectory } = this.props
    const customHeight = containerWidth / reso_x * reso_y
    let data = [], count = 0
    if (trajectory) {
      data = trajectory.data
      count = trajectory.count
    }

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
      legend: { x: 0, y: 1.25, orientation: "h" },
      plot_bgcolor: colors.backgroundColor,
      paper_bgcolor: colors.backgroundColor,
      margin: {
        t: 24,
        pad: 8
      },
      xaxis: { range: [0, parseInt(reso_x)] },
      yaxis: { range: [parseInt(reso_y), 0] },
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

    return (
      <div>
        <h5 className={media==='MOBILE' ? styles.m_sum : styles.sum}>{data.length} displayed out of {count} objects detected.</h5>
        {
          (chartData.length===0) ?
          <div style={{height: `2.5rem`}}></div> :
          <Plot
            data={chartData}
            layout={media === MOBILE ? mobileLayout : webLayout}
            config={media === MOBILE ? mobileConfig : webConfig}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  id: state.sensor.visual.id,
  trajectory: state.sensor.visual.trajectory,
  reso_x: state.sensor.visual.reso_x,
  reso_y: state.sensor.visual.reso_y,
  analysisPeriod: state.charts.analysisPeriod
})

const mapDispatchToProps = {
  getTrajectoryData
}

export default withDimension({
  className: styles.wrapper
})(connect(mapStateToProps, mapDispatchToProps)(TrajectoryChart))