import React, { Component } from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { addAirMarkers } from '../../../state/ducks/map/actions'
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import { mapStyles } from './MapStyles'
import './map.module.scss'

class Map extends Component {
  componentDidMount = () => {
    this.props.addAirMarkers()
  }

  render() {
    let markers
    if (this.props.airMarkers !== undefined) {
      markers = this.props.airMarkers.map( (marker, index) => (
        <Marker
          key = {index}
          position = {{ lng: parseFloat(marker.long), lat: parseFloat(marker.lat) }}
          icon = {{url:require('../../../assets/img/marker_lvl1.svg')}}
        />
      ))
    }
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
        { markers }
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

Map.propTypes = {
  airMarkers: propTypes.array,
  visualMarkers: propTypes.array
}

const mapStateToProps = state => ({
  airMarkers: state.map.airMarkers,
  visualMarkers: state.map.visualMarkers
});

const mapDispatchToProps = {
  addAirMarkers
}

export default connect(mapStateToProps, mapDispatchToProps)(Map)