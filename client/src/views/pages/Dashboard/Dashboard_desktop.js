import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Map from '../../components/map/Map'

export default class Dashboard_desktop extends Component {
  static propTypes = {
    
  }

  render() {
    return (
      <div>
        <Map/>
      </div>
    )
  }
}
