import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import classNames from 'classnames'
import DatePicker from 'react-datepicker'
import CheckIcon from 'react-feather/dist/icons/check'
import XIcon from 'react-feather/dist/icons/x'
import { updateAnalysisPeriod } from '../../../state/ducks/charts/actions'

import styles from './PeriodPicker.module.scss'

class PeriodPicker extends Component {
  static propTypes = {
    analysisPeriod: PropTypes.object,
    updateAnalysisPeriod: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      customeVisibility: false
    }
  }

  handlePeriodChanged = (name) => {
    const { updateAnalysisPeriod } = this.props
    if (name === 'custom') {
      this.handleToggleCustom()
      updateAnalysisPeriod({
        name,
        startDate: this.state.startDate,
        endDate: this.state.endDate
      })
    }
    else {
      if (this.state.customVisibility)
        this.handleToggleCustom()
      updateAnalysisPeriod({
        name,
        startDate: moment().startOf(name).toDate(),
        endDate: new Date()
      })
    }
  }

  handleToggleCustom = () => {
    this.setState({ customVisibility: !this.state.customVisibility })
  }

  handleChangeStart = (date) => {
    this.setState({ startDate: date })
  }

  handleChangeEnd = (date) => {
    this.setState({ endDate: date })
  }

  onDatepickerRef = (el) => {
    if (el && el.input) { el.input.readOnly = true }
  }

  render() {
    const { name } = this.props.analysisPeriod

    return (
      <div>
        <div className={styles.container}>
          <h5>Choose analysis period</h5>
          <div onClick={() => this.handlePeriodChanged('day')} className={classNames({ [styles.item]: true, [styles.active]: name==='day' })}>
            <h5>Today</h5>
          </div>
          <div onClick={() => this.handlePeriodChanged('week')} className={classNames({ [styles.item]: true, [styles.active]: name==='week' })}>
            <h5>This week</h5>
          </div>
          <div onClick={() => this.handlePeriodChanged('month')} className={classNames({ [styles.item]: true, [styles.active]: name==='month' })}>
            <h5>This month</h5>
          </div>
          <div onClick={this.handleToggleCustom} className={classNames({ [styles.item]: true, [styles.active]: name==='custom', [styles.custom]: true })}>
            <h5>Custom...</h5>
          </div>
        </div>
        <div className={classNames({ [styles.datepickerContainer]: true, [styles.hidden]: !this.state.customVisibility })}>
          <DatePicker
            selected={this.state.startDate}
            selectsStart
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            dateFormat="dd-MM-yyyy"
            onChange={this.handleChangeStart}
            className={styles.datepicker}
            ref={el => this.onDatepickerRef(el)}
          />
          <DatePicker
            selected={this.state.endDate}
            selectsEnd
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            dateFormat="dd-MM-yyyy"
            onChange={this.handleChangeEnd}
            className={styles.datepicker}
            ref={el => this.onDatepickerRef(el)} 
          />
          <CheckIcon className={styles.icon} onClick={() => { this.handlePeriodChanged('custom')}} />
          <XIcon className={styles.icon} onClick={this.handleToggleCustom} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  analysisPeriod: state.charts.analysisPeriod
})

const mapDispatchToProps = {
  updateAnalysisPeriod
}

export default connect(mapStateToProps, mapDispatchToProps)(PeriodPicker)

