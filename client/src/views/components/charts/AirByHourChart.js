import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getAvgAirDataByHour, getMinAirDataByHour, getMaxAirDataByHour } from '../../../state/ducks/sensor/actions'
import { changeAirDowChart, changeAirTypeHourChart } from '../../../state/ducks/charts/actions'
import { VictoryBar, VictoryChart, VictoryAxis, VictoryGroup, VictoryLegend, VictoryTooltip } from 'victory'
import Select from 'react-select'
import LeftIcon from 'react-feather/dist/icons/chevron-left'
import RightIcon from 'react-feather/dist/icons/chevron-right'
import withDimension from 'react-dimensions'
import { MyVictoryTheme } from '../../../utils/victoryTheme'
import styles from './AirByHourChart.module.scss'

class AirByHourChart extends Component {
  static propTypes = {
    sensor: PropTypes.object,
    day: PropTypes.number,
    type: PropTypes.string,

    getAvgAirDataByHour: PropTypes.func,
    getMinAirDataByHour: PropTypes.func, 
    getMaxAirDataByHour: PropTypes.func,
    changeAirDowChart: PropTypes.func,
    changeAirTypeHourChart: PropTypes.func
  }
  
  componentDidMount = () => {
    const {type} = this.props
    if (type === "avg")
      this.props.getAvgAirDataByHour(this.props.sensor.id)
    switch (this.props.type) {
      case "avg": this.props.getAvgAirDataByHour(this.props.sensor.id)
        break
      case "min": this.props.getMinAirDataByHour(this.props.sensor.id)
        break
      case "max": this.props.getMaxAirDataByHour(this.props.sensor.id)
        break
      default: break
    }
  }

  componentDidUpdate = () => {
    const {type} = this.props
    if (type === "avg")
      this.props.getAvgAirDataByHour(this.props.sensor.id)
    switch (this.props.type) {
      case "avg": this.props.getAvgAirDataByHour(this.props.sensor.id)
        break
      case "min": this.props.getMinAirDataByHour(this.props.sensor.id)
        break
      case "max": this.props.getMaxAirDataByHour(this.props.sensor.id)
        break
      default: break
    }
  }

  handleDayDecreased = (day, e) => {
    e.preventDefault()
    this.props.changeAirDowChart(day===0 ? 6 : day-1)
  }

  handleDayIncreased = (day, e) => {
    e.preventDefault()
    this.props.changeAirDowChart(day===6 ? 0 : day+1)
  }

  handleTypeChanged = (selected) => {
    this.props.changeAirTypeHourChart(selected.value)
  }

  render() {
    const { sensor, containerHeight, containerWidth, day, type } = this.props
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    let data = []
    for (let i = 0; i < 7; i++)
      data[i] = []
    if (sensor.byHour !== undefined)
      if (sensor.byHour[type] !== undefined)
        sensor.byHour[type].forEach(d => {
          data[d.dow].push({
            hour: d.hour,
            pm2_5: Math.round(parseFloat(d.pm2_5)),
            pm10: Math.round(parseFloat(d.pm10)),
            label: `PM2.5:  ${Math.round(parseFloat(d.pm2_5))}, PM10:  ${Math.round(parseFloat(d.pm10))}`
          }) 
        })

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
              style={{
                margin: 10
              }}
              animate={{
                duration: 400,
                onLoad: { duration: 200 }
              }}
              barRatio={1}
              data={data[day]}
              x="hour"
              y="pm2_5"
              labelComponent={<VictoryTooltip  />}
            />
            <VictoryBar
              animate={{
                duration: 400,
                onLoad: { duration: 200 }
              }}
              barRatio={1}
              data={data[day]}
              x="hour"
              y="pm10"
              labelComponent={<VictoryTooltip/>}
            />
          </VictoryGroup>
          <VictoryLegend 
            x={48}
            theme={MyVictoryTheme}
            height={100}
            padding={{left: 40, bottom: 100, top: 24, right: 0}}
            data={[
              { name: "PM2.5" },
              { name: "PM10" }
            ]}
          />
        </VictoryChart>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  sensor: state.sensor.air,
  day: state.charts.byHour.air.dow,
  type: state.charts.byHour.air.type
})

const mapDispatchToProps = {
  changeAirDowChart,
  changeAirTypeHourChart,
  getAvgAirDataByHour,
  getMinAirDataByHour,
  getMaxAirDataByHour
}

export default withDimension({
  className: styles.wrapper
})(connect(mapStateToProps, mapDispatchToProps)(AirByHourChart))