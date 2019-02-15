import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DESK } from '../../../utils/const'
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory'
import withDimension from 'react-dimensions'
import { MyVictoryTheme } from '../../../utils/victoryTheme'
import styles from './VisualLiveChart.module.scss'

class VisualLiveChart extends Component {
  static propTypes = {
    sensorData: PropTypes.object,
    media: PropTypes.string
  }

  render() {
    const { sensorData, containerHeight, containerWidth, media } = this.props
    const liveData = [
      { type: "Pesdestrians", counter: sensorData === undefined ? 0 : parseFloat(sensorData.pedestrians)},
      { type: "Bicycles", counter: sensorData === undefined ? 0 : parseFloat(sensorData.bicycles)},
      { type: "Others", counter: sensorData === undefined ? 0 : parseFloat(sensorData.vehicles)},
    ]

    return (
      <VictoryChart
        horizontal
        theme={MyVictoryTheme}
        domainPadding={media===DESK ? 32 : 10}
        height={containerHeight}
        width={containerWidth}
        padding={{left: 88, right: 100, top: 24, bottom: 80}}
      >
        <VictoryAxis />
        <VictoryAxis dependentAxis />
        <VictoryBar
          data={liveData}
          x='type'
          y='counter'
        />
      </VictoryChart>
    )
  }
}

const mapStateToProps = (state) => ({
  sensorData: state.sensor.visual
})

const mapDispatchToProps = {
  
}

export default withDimension({
  className: styles.wrapper
})(connect(mapStateToProps, mapDispatchToProps)(VisualLiveChart))