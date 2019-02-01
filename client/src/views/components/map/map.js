import React, { Component } from 'react'
import propTypes from 'prop-types'
import { compose, withProps, withHandlers } from 'recompose'
import { connect } from 'react-redux'
import { addAirMarkers } from '../../../state/ducks/map/actions'
import { withGoogleMap, withScriptjs, GoogleMap, Marker } from 'react-google-maps'
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer";
import { mapStyles } from './MapStyles'
import './map.module.scss'



class Map extends Component {
  componentDidMount = () => {
    this.props.addAirMarkers()
  }

  render() {
    // load markers
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

    const StyledMap = compose(
      withProps({
        loadingElement: <div style={{ height: `100%` }} /> ,
        containerElement: <div style={{ height: `100vh` }} />,
        mapElement: <div style={{ height: `100%` }} />,
      }),
      withHandlers({
        onMarkerClustererClick: () => (markerClusterer) => {
          const clickedMarkers = markerClusterer.getMarkers()
          console.log(`Current clicked markers length: ${clickedMarkers.length}`)
          console.log(clickedMarkers)
        }
      }),
      withGoogleMap
    )(props => 
      <GoogleMap
        defaultCenter = { { lat: -34.4054, lng: 150.8784 } }
        defaultZoom = { 15 }
        defaultOptions = {{
          styles: mapStyles, 
          streetViewControl: false,
          mapTypeControl: false
        }}
      >
        <MarkerClusterer
          onClick={props.onMarkerClustererClick}
          averageCenter
          enableRetinaIcons
          gridSize={60}
        >
          { markers }
        </MarkerClusterer>
      </GoogleMap>
    )

    return(
      <div>
        <StyledMap />
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