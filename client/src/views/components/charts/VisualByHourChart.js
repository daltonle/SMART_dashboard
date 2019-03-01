import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getAvgVisualDataByHour, getMinVisualDataByHour, getMaxVisualDataByHour } from '../../../state/ducks/sensor/actions'
import { changeVisualDowChart, changeVisualTypeHourChart } from '../../../state/ducks/charts/actions'
import { VictoryBar, VictoryChart, VictoryAxis, VictoryGroup, VictoryLegend, VictoryTooltip } from 'victory'
import Select from 'react-select'
import LeftIcon from 'react-feather/dist/icons/chevron-left'
import RightIcon from 'react-feather/dist/icons/chevron-right'
import withDimension from 'react-dimensions'
import { MyVictoryTheme } from '../../../utils/victoryTheme'
import styles from './VisualByHourChart.module.scss'

class VisualByHourChart extends Component {
  static propTypes = {
    sensor: PropTypes.object,
    day: PropTypes.number,
    type: PropTypes.string,

    getAvgVisualDataByHour: PropTypes.func,
    getMinVisualDataByHour: PropTypes.func,
    getMaxVisualDataByHour: PropTypes.func,
    changeVisualDowChart: PropTypes.func,
    changeVisualTypeHourChart: PropTypes.func
  }
  
  componentDidMount = () => {
    this.props.getAvgVisualDataByHour(this.props.sensor.id)
    this.props.getMinVisualDataByHour(this.props.sensor.id)
    this.props.getMaxVisualDataByHour(this.props.sensor.id)
  }

  handleDayDecreased = (day, e) => {
    e.preventDefault()
    this.props.changeVisualDowChart(day==0 ? 6 : day-1)
  }

  handleDayIncreased = (day, e) => {
    e.preventDefault()
    this.props.changeVisualDowChart(day==6 ? 0 : day+1)
  }

  handleTypeChanged = (selected) => {
    this.props.changeVisualTypeHourChart(selected.value)
  }

  render() {
    const { sensor, containerHeight, containerWidth, day, type } = this.props
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    let dataPedestrians = [],
        dataBicycle = [],
        dataVehicles = []
    for (let i = 0; i < 7; i++) {
      dataPedestrians[i] = []
      dataBicycle[i] = []
      dataVehicles[i] = []
    }
    if (sensor.byHour !== undefined) {
      if (sensor.byHour[type] !== undefined) {
        sensor.byHour[type]
          .filter(d => d.type === 'pedestrian')
          .map(d => dataPedestrians[d.dow].push({
            hour: d.hour,
            counter: Math.round(parseFloat(d.counter))
          }))
        sensor.byHour[type]
          .filter(d => d.type === 'bicycle')
          .map(d => dataBicycle[d.dow].push({
            hour: d.hour,
            counter: Math.round(parseFloat(d.counter))
          }))
        sensor.byHour[type]
          .filter(d => d.type === 'vehicle')
          .map(d => dataVehicles[d.dow].push({
            hour: d.hour,
            counter: Math.round(parseFloat(d.counter))
          }))
      }
    }

    return (
      <div>
        <div className={styles.options}>
          <LeftIcon className={styles.icon} onClick={e => this.handleDayDecreased(day, e)}/>
          <h5>{days[day]}</h5>
          <RightIcon className={styles.icon} onClick={e => this.handleDayIncreased(day, e)}/>
          <div className={styles.dropdown}>
            <Select
              defaultValue={{ value: `${type}`, label: type==="avg" ? "average" : (type==="min" ? "minimum" : "maximum") }}
              onChange={this.handleTypeChanged}
              options={[
                { value: "avg", label: "average" },
                { value: "min", label: "minimum" },
                { value: "max", label: "maximum" }
              ]}
            />
          </div>
        </div>
        <VictoryChart
          theme={MyVictoryTheme}
          height={containerHeight}
          width={containerWidth}
          padding={{left: 88, right: 100, top: 40, bottom: 100}}
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
            offset={6}
            style={{
              data: {
                width: 4
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
              data={dataVehicles[day]}
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
              { name: "Vehicles" }
            ]}
          />
        </VictoryChart>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  sensor: state.sensor.visual,
  day: state.charts.byHour.visual.dow,
  type: state.charts.byHour.visual.type
})

const mapDispatchToProps = {
  getAvgVisualDataByHour,
  getMaxVisualDataByHour,
  getMinVisualDataByHour,
  changeVisualDowChart,
  changeVisualTypeHourChart
}

export default withDimension({
  className: styles.wrapper
})(connect(mapStateToProps, mapDispatchToProps)(VisualByHourChart))