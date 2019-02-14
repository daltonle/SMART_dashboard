import React, { Component } from 'react'
import propTypes from 'prop-types'
import { compose, withProps, withHandlers } from 'recompose'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { addAirMarkers, addVisualMarkers, changeCentre } from '../../../state/ducks/map/actions'
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer"
import { mapStyles } from './MapStyles'

class Map extends Component {
  static propTypes = {
    airMarkers: propTypes.array,
    visualMarkers: propTypes.array,
    isAirLayer: propTypes.bool,
    centre: propTypes.object,
    addAirMarkers: propTypes.func,
    addVisualMarkers: propTypes.func
  }

  componentDidMount = () => {  
    this.props.addAirMarkers()
    this.props.addVisualMarkers()
  }

  handleMarkerClick = (marker, e) => {
    let newCentre = {
      lng: parseFloat(marker.long),
      lat: parseFloat(marker.lat)
    }
    this.props.changeCentre(newCentre)
    this.props.history.push(`/dashboard/${marker.lat},${marker.long}`)
  }

  render() {
    // load markers
    let markers
    if (this.props.isAirLayer && this.props.airMarkers !== undefined) {
      let { airMarkers } = this.props
      markers = airMarkers.map((marker, index) => (
        <Marker
          key={index}
          position={{ lng: parseFloat(marker.long), lat: parseFloat(marker.lat) }}
          icon={{ url: require('../../../assets/icons/marker_lvl1.svg') }}
          onClick={(e) => this.handleMarkerClick(marker, e)}
        />
      ))
    }
    else if (!this.props.isAirLayer && this.props.visualMarkers !== undefined) {
      markers = this.props.visualMarkers.map((marker, index) => (
        <Marker
          key={index}
          position={{ lng: parseFloat(marker.long), lat: parseFloat(marker.lat) }}
          icon={{ url: require('../../../assets/icons/marker_lvl1.svg') }}
          onClick={(e) => this.handleMarkerClick(marker, e)}
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
          markerClusterer.getMarkers()
        }
      }),
      withGoogleMap
    )(props =>
      <GoogleMap
        defaultCenter={this.props.mapCentre}
        defaultZoom={13}
        defaultOptions={{
          styles: mapStyles,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false
        }}
        zoomControlOptions={{
          borderRadius: `.2em`
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
  isAirLayer: state.map.isAirLayer,
  mapCentre: state.map.centre
})

const mapDispatchToProps = {
  addAirMarkers,
  addVisualMarkers,
  changeCentre
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Map))