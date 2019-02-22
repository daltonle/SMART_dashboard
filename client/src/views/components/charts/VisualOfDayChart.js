import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Plot from 'react-plotly.js'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import withDimension from 'react-dimensions'
import { MOBILE } from '../../../utils/const'
import { colors } from '../../../styles/colors'
import styles from './VisualOfDayChart.module.scss'

class VisualOfDayChart extends Component {
  static propTypes = {
    media: PropTypes.string,
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

  onDatepickerRef = (el) => {
    if (el && el.input) { el.input.readOnly = true }
  }

  render() {
    const { containerHeight, containerWidth, media } = this.props

    const data = [
      {
        ...this.getData("pedestrian"),
        name: "Pedestrian",
        type: 'scatter',
        mode: 'markers',
        marker: { color: colors.green, opacity: 0.7 }
      },
      {
        ...this.getData("bicycle"),
        name: "Bicycle",
        type: "scatter",
        mode: "markers",
        marker: { color: colors.red, opacity: 0.7 }
      },
      {
        ...this.getData("vehicle"),
        name: "Others",
        type: "scatter",
        mode: "markers",
        marker: { color: colors.yellow, opacity: 0.7 }
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

    const mobileCongig = {
      ...webConfig,
      displayModeBar: true
    }

    return (
      <div className={styles.container}> 
        <div className={styles.options}>
          <h5>Choose a date</h5>
          <DatePicker
            dateFormat="dd-MM-yyyy"
            selected={this.state.selectedDate}
            onChange={date => this.handleDateChange(date)}
            className={styles.datepicker}
            ref={el => this.onDatepickerRef(el)}
          />
        </div>
        <Plot
          data={data}
          config={media===MOBILE ? mobileCongig : webConfig}
          layout={media===MOBILE ? mobileLayout : webLayout}
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
})(connect(mapStateToProps, mapDispatchToProps)(VisualOfDayChart))