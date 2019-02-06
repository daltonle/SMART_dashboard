import React, { Component } from 'react'
import propTypes from 'prop-types'
import { compose, withProps, withHandlers } from 'recompose'
import { connect } from 'react-redux'
import { addAirMarkers, addVisualMarkers } from '../../../state/ducks/map/actions'
import { withGoogleMap, GoogleMap, Marker, ControlPosition } from 'react-google-maps'
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer"
import { mapStyles } from './MapStyles'

class Map extends Component {
  static propTypes = {
    airMarkers: propTypes.array,
    visualMarkers: propTypes.array,
    isAirLayer: propTypes.bool
  }

  componentDidMount = () => {  
    this.props.addAirMarkers()
    this.props.addVisualMarkers()
  }

  render() {
    // load markers
    let markers
    if (this.props.isAirLayer && this.props.airMarkers !== undefined) {
      // some fake data
      // TODO: remove fake data
      let airMarkers = [
        { lat: -34.4054, long: 150.8784 },
        { lat: -40.4054, long: 160.8784 },
        ...this.props.airMarkers
      ]

      markers = airMarkers.map((marker, index) => (
        <Marker
          key={index}
          position={{ lng: parseFloat(marker.long), lat: parseFloat(marker.lat) }}
          icon={{ url: require('../../../assets/icons/marker_lvl1.svg') }}
        />
      ))
    }
    else if (!this.props.isAirLayer && this.props.visualMarkers !== undefined) {
      markers = this.props.visualMarkers.map((marker, index) => (
        <Marker
          key={index}
          position={{ lng: parseFloat(marker.long), lat: parseFloat(marker.lat) }}
          icon={{ url: require('../../../assets/icons/marker_lvl1.svg') }}
        />
      ))
    }
    // TODO: add Markers data + last fetch time to localStorage, test for this before fetch for new data

    const StyledMap = compose(
      withProps({
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ width: `100%`, height: `100%` }} />,
        mapElement: <div style={{ height: `100%`, width:`100%` }} />,
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
        defaultCenter={{ lat: -34.4054, lng: 150.8784 }}
        defaultZoom={15}
        defaultOptions={{
          styles: mapStyles,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false
        }}
        zoomControlOptions={{
          position: window.google.maps.ControlPosition.TOP_RIGHT
        }}
      >
        <MarkerClusterer
          onClick={props.onMarkerClustererClick}
          averageCenter
          enableRetinaIcons
          gridSize={60}
          styles={[
            {
              url: require('../../../assets/icons/marker_clusterer.svg'),
              width: 56,
              height: 56,
              textColor: '#ffffff',
              textSize: 12,
              anchorText: [0, 0]
            }
          ]}
        >
          {markers}
        </MarkerClusterer>
      </GoogleMap>
    )

    return(
      <StyledMap />
    )
  }
}

const mapStateToProps = state => ({
  airMarkers: state.map.airMarkers,
  visualMarkers: state.map.visualMarkers,
  isAirLayer: state.map.isAirLayer
})

const mapDispatchToProps = {
  addAirMarkers,
  addVisualMarkers
}

export default connect(mapStateToProps, mapDispatchToProps)(Map)