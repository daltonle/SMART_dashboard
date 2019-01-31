import React, { Component } from 'react'
//import PropTypes from 'prop-types'
//import { connect } from 'react-redux'
import { withGoogleMap, GoogleMap } from 'react-google-maps'
import { InfoBox } from 'react-google-maps/lib/components/addons/InfoBox'
import { mapStyles } from './MapStyles'
import './map.module.scss'

class Map extends Component {
  render() {
    const StyledMap = withGoogleMap(props => (
      <GoogleMap
        defaultCenter = { { lat: -34.4054, lng: 150.8784 } }
        defaultZoom = { 15 }
        defaultOptions = {{
          styles: mapStyles, 
          streetViewControl: false,
          mapTypeControl: false
        }}
      >
      </GoogleMap>
    ));

    return(
      <div>
        <StyledMap
          containerElement={ <div style={{ height: `100vh`, width: '100vw' }} /> }
          mapElement={ <div style={{ height: `100%` }} /> }
        />
      </div>
    );
  }
}

export default Map