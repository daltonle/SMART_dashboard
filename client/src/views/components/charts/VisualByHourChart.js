import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getAvgVisualDataByHour } from '../../../state/ducks/sensor/actions'
import { changeVisualDowChart } from '../../../state/ducks/charts/actions'
import { VictoryBar, VictoryChart, VictoryAxis, VictoryGroup, VictoryLegend, VictoryTooltip } from 'victory'
import LeftIcon from 'react-feather/dist/icons/chevron-left'
import RightIcon from 'react-feather/dist/icons/chevron-right'
import withDimension from 'react-dimensions'
import { MyVictoryTheme } from '../../../utils/victoryTheme'
import styles from './VisualByHourChart.module.scss'

class VisualByHourChart extends Component {
  static propTypes = {
    sensor: PropTypes.object,
    day: PropTypes.number,

    getAvgVisualDataByHour: PropTypes.func,
    changeVisualDowChart: PropTypes.func
  }
  
  componentDidMount = () => {
    this.props.getAvgVisualDataByHour(this.props.sensor.id)
  }

  handleDayDecreased = (day, e) => {
    e.preventDefault()
    this.props.changeVisualDowChart(day==0 ? 6 : day-1)
  }

  handleDayIncreased = (day, e) => {
    e.preventDefault()
    this.props.changeVisualDowChart(day==6 ? 0 : day+1)
  }

  render() {
    const { sensor, containerHeight, containerWidth, day } = this.props
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    let dataPedestrians = [],
        dataBicycle = [],
        dataOthers = []
    for (let i = 0; i < 7; i++) {
      dataPedestrians[i] = []
      dataBicycle[i] = []
      dataOthers[i] = []
    }
    if (sensor.byHour !== undefined) {
      sensor.byHour
        .filter(d => d.type === 'pedestrian')
        .map(d => dataPedestrians[d.dow].push({
          hour: d.hour,
          counter: Math.round(parseFloat(d.counter))
        }))
      sensor.byHour
        .filter(d => d.type === 'bicycle')
        .map(d => dataBicycle[d.dow].push({
          hour: d.hour,
          counter: Math.round(parseFloat(d.counter))
        }))
      sensor.byHour
        .filter(d => d.type === 'vehicle')
        .map(d => dataOthers[d.dow].push({
          hour: d.hour,
          counter: Math.round(parseFloat(d.counter))
        }))
    }

    return (
      <div>
        <div className={styles.dayPicker}>
          <LeftIcon className={styles.icon} onClick={e => this.handleDayDecreased(day, e)}/>
          <h5>{days[day]}</h5>
          <RightIcon className={styles.icon} onClick={e => this.handleDayIncreased(day, e)}/>
        </div>
        <VictoryChart
          theme={MyVictoryTheme}
          height={containerHeight}
          width={containerWidth}
          padding={{left: 88, right: 100, top: 40, bottom: 80}}
          singleQuadrantDomainPadding={{x: false}}
          domainPadding={{x: 16, y: 40}}
        >
          
          <VictoryAxis 
            tickValues={[0,4,8,12,16,20,24]}
          />
          <VictoryAxis dependentAxis  
            offsetX={88} 
          />
          <VictoryGroup
            offset={10}
            style={{
              data: {
                width: 8
              }
            }}
            
          >
            <VictoryBar
              animate={{
                duration: 400,
                onLoad: { duration: 200 }
              }}
              barRatio={1}
              data={dataPedestrians[day]}
              x="hour"
              y="counter"
              labelComponent={<VictoryTooltip  />}
            />
            <VictoryBar
              animate={{
                duration: 400,
                onLoad: { duration: 200 }
              }}
              barRatio={1}
              data={dataBicycle[day]}
              x="hour"
              y="counter"
              labelComponent={<VictoryTooltip/>}
            />
            <VictoryBar
              animate={{
                duration: 400,
                onLoad: { duration: 200 }
              }}
              barRatio={1}
              data={dataOthers[day]}
              x="hour"
              y="counter"
              labelComponent={<VictoryTooltip/>}
            />
          </VictoryGroup>
          <VictoryLegend 
            x={48}
            theme={MyVictoryTheme}
            data={[
              { name: "Pedestrian" },
              { name: "Bicycle" },
              { name: "Others" }
            ]}
          />
        </VictoryChart>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  sensor: state.sensor.visual,
  day: state.charts.byHour.visual.dow
})

const mapDispatchToProps = {
  getAvgVisualDataByHour,
  changeVisualDowChart
}

export default withDimension({
  className: styles.wrapper
})(connect(mapStateToProps, mapDispatchToProps)(VisualByHourChart))