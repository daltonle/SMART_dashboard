import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Plot from 'react-plotly.js'
import { getAvgVisualDataByHour, getMinVisualDataByHour, getMaxVisualDataByHour } from '../../../state/ducks/sensor/actions'
import { changeVisualDowChart, changeVisualTypeHourChart } from '../../../state/ducks/charts/actions'
import { MOBILE } from '../../../utils/const'
import Select from 'react-select'
import LeftIcon from 'react-feather/dist/icons/chevron-left'
import RightIcon from 'react-feather/dist/icons/chevron-right'
import withDimension from 'react-dimensions'
import { colors } from '../../../styles/colors'
import styles from './VisualByHourChart.module.scss'

class VisualByHourChart extends Component {
  static propTypes = {
    sensor: PropTypes.object,
    day: PropTypes.number,
    type: PropTypes.string,
    media: PropTypes.string,
    analysisPeriod: PropTypes.object,

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

  componentDidUpdate = async (prevProps) => {
    if (this.props.analysisPeriod !== prevProps.analysisPeriod) {
      await this.props.getAvgVisualDataByHour(this.props.sensor.id)
      await this.props.getMinVisualDataByHour(this.props.sensor.id)
      await this.props.getMaxVisualDataByHour(this.props.sensor.id)
      this.forceUpdate()
    }
  }

  handleDayDecreased = (day, e) => {
    e.preventDefault()
    this.props.changeVisualDowChart(day===0 ? 6 : day-1)
  }

  handleDayIncreased = (day, e) => {
    e.preventDefault()
    this.props.changeVisualDowChart(day===6 ? 0 : day+1)
  }

  handleTypeChanged = (selected) => {
    this.props.changeVisualTypeHourChart(selected.value)
  }

  getData = () => {
    const { sensor, type } = this.props
    let data = []
    for (let i = 0; i < 7; i++)
      data[i] = {
        pedestrian: { x:[], y:[] },
        bicycle: { x:[], y:[] },
        vehicle: { x:[], y:[] }
      }
    if (sensor.byHour !== undefined)
      if (sensor.byHour[type] !== undefined) {
        sensor.byHour[type].forEach(d => {
          let { dow, hour, counter } = d
          data[dow][d.type].x.push(hour)
          data[dow][d.type].y.push(counter)
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
        ...data[day].pedestrian,
        name: "Pedestrian",
        type: 'bar',
        marker: { color: colors.green, opacity: 0.7 }
      },
      {
        ...data[day].bicycle,
        name: "Bicycle",
        type: "bar",
        marker: { color: colors.red, opacity: 0.7 }
      },
      {
        ...data[day].vehicle,
        name: "Vehicle",
        type: "bar",
        marker: { color: colors.yellow, opacity: 0.7}
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
            />
          </div>
        </div>
        {
          (chartData[0].x.length===0 && chartData[1].x.length===0 && chartData[2].x.length===0) ?
          <div className={styles.noData}>
            <p>No data.</p>
          </div> :
          <Plot
            data={chartData}
            layout={media===MOBILE ? mobileLayout : webLayout}
            config={media===MOBILE ? mobileCongig : webConfig}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  sensor: state.sensor.visual,
  day: state.charts.byHour.visual.dow,
  type: state.charts.byHour.visual.type,
  analysisPeriod: state.charts.analysisPeriod
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