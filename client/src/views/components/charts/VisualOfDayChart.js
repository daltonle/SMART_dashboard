import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Plot from 'react-plotly.js'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import withDimension from 'react-dimensions'
import { colors } from '../../../styles/colors'
import styles from './VisualOfDayChart.module.scss'

class VisualOFDayChart extends Component {
  static propTypes = {
    sensor: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {
      selectedDate: new Date()
    }
  }
  
  componentDidMount = () => {
    
  }

  handleDateChange = (date) => {
    this.setState({
      selectedDate: date
    })
  }

  getData = (name) => {
    const { sensor } = this.props
    let data = { x:[], y:[] }

    if (sensor === undefined)
      return {}
    else if (this.state === undefined)
      return {}
    else {
      const { selectedDate } = this.state
      if (sensor.history === undefined)
        return {}
      else {
        sensor.history.filter(
          d => moment(d.timestamp, 'DD-MM-YYYY HH:mm:ss').isSame(moment(selectedDate), 'day')
        ).filter(
          d => d.type === name
        ).forEach(d => {
          data.x.push(moment(d.timestamp, 'DD-MM-YYYY HH:mm:ss').toDate())
          data.y.push(parseFloat(d.counter))
        })
        return data
      }
    }
  }

  render() {
    const { containerHeight, containerWidth } = this.props
    const dataPedestrian = this.getData("pedestrian")
    const dataBicycle = this.getData("bicycle")
    const dataVehicle = this.getData("vehicle")

    return (
      <div>
        <div className={styles.options}>
          <h5>Choose a date</h5>
          <DatePicker
            dateFormat="dd-MM-yyyy"
            selected={this.state.selectedDate}
            onChange={date => this.handleDateChange(date)}
            className={styles.datepicker}
          />
        </div>
        <Plot
          data={[
            {
              x: dataPedestrian.x,
              y: dataPedestrian.y,
              name: "Pedestrian",
              type: 'scatter',
              mode: 'markers',
              marker: { color: colors.green, opacity: 0.7 }
            },
            {
              x: dataBicycle.x,
              y: dataBicycle.y,
              name: "Bicycle",
              type: "scatter",
              mode: "markers",
              marker: { color: colors.red, opacity: 0.7 }
            },
            {
              x: dataVehicle.x,
              y: dataVehicle.y,
              name: "Others",
              type: "scatter",
              mode: "markers",
              marker: { color: colors.yellow, opacity: 0.7 }
            }
          ]}
          config={{
            modeBarButtonsToRemove: ['toImage', 'sendDataToCloud', 'select2d', 'lasso2d', 'toggleSpikelines'],
            displaylogo: false,
          }}
          layout={{ 
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
          }}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  sensor: state.sensor.visual
})

const mapDispatchToProps = {}

export default withDimension({
  className: styles.wrapper
})(connect(mapStateToProps, mapDispatchToProps)(VisualOFDayChart))