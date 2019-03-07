import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getAvgAirDataByHour, getMinAirDataByHour, getMaxAirDataByHour } from '../../../state/ducks/sensor/actions'
import { changeAirDowChart, changeAirTypeHourChart } from '../../../state/ducks/charts/actions'
import Plot from 'react-plotly.js'
import Select from 'react-select'
import LeftIcon from 'react-feather/dist/icons/chevron-left'
import RightIcon from 'react-feather/dist/icons/chevron-right'
import withDimension from 'react-dimensions'
import { MOBILE } from '../../../utils/const'
import { colors } from '../../../styles/colors'
import styles from './AirByHourChart.module.scss'

class AirByHourChart extends Component {
  static propTypes = {
    media: PropTypes.string,
    sensor: PropTypes.object,
    day: PropTypes.number,
    type: PropTypes.string,
    analysisPeriod: PropTypes.object,

    getAvgAirDataByHour: PropTypes.func,
    getMinAirDataByHour: PropTypes.func, 
    getMaxAirDataByHour: PropTypes.func,
    changeAirDowChart: PropTypes.func,
    changeAirTypeHourChart: PropTypes.func
  }
  
  componentDidMount = () => {
    const { getAvgAirDataByHour, getMinAirDataByHour, getMaxAirDataByHour, sensor, analysisPeriod } = this.props
    getAvgAirDataByHour(sensor.id)
    getMinAirDataByHour(sensor.id)
    getMaxAirDataByHour(sensor.id)
  }

  componentDidUpdate = async (prevProps) => {
    if (this.props.analysisPeriod !== prevProps.analysisPeriod) {
      const { getAvgAirDataByHour, getMinAirDataByHour, getMaxAirDataByHour, sensor, analysisPeriod } = this.props
      await getAvgAirDataByHour(sensor.id)
      await getMinAirDataByHour(sensor.id)
      await getMaxAirDataByHour(sensor.id)
      this.forceUpdate()
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

  getData = () => {
    const { sensor, type } = this.props
    let data = []
    for (let i = 0; i < 7; i++)
      data[i] = {
        pm2_5: { x:[], y:[] },
        pm10: { x:[], y:[] }
      }
    if (sensor.byHour !== undefined)
      if (sensor.byHour[type] !== undefined) {
        sensor.byHour[type].forEach(d => {
          let { dow, hour } = d
          data[dow].pm2_5.x.push(hour)
          data[dow].pm2_5.y.push(d.pm2_5)
          data[dow].pm10.x.push(hour)
          data[dow].pm10.y.push(d.pm10)
        })
      }
    
    return data
  }

  render() {
    const { containerHeight, containerWidth, day, type, media } = this.props
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const data = this.getData()

    const chartData = [
      {
        ...data[day].pm2_5,
        name: "PM2_5",
        type: 'bar',
        marker: { color: colors.green, opacity: 1 }
      },
      {
        ...data[day].pm10,
        name: "PM10",
        type: "bar",
        marker: { color: colors.red, opacity: 1 }
      }
    ]

    // chart layout
    const webLayout = { 
      width: containerWidth, 
      height: containerHeight,
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
        r: 24,
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
              theme={(theme) => ({
                ...theme,
                borderRadius: `3px`,
                colors: {
                  ...theme.colors,
                  primary25: colors.primaryColor_1,
                  primary50: colors.primaryColor_3,
                  primary: colors.primaryColor,
                }
              })}
            />
          </div>
        </div>
        <Plot
          data={chartData}
          layout={media===MOBILE ? mobileLayout : webLayout}
          config={media===MOBILE ? mobileCongig : webConfig}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  sensor: state.sensor.air,
  day: state.charts.byHour.air.dow,
  type: state.charts.byHour.air.type,
  analysisPeriod: state.charts.analysisPeriod
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