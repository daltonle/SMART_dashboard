import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose, withProps, withHandlers, shouldUpdate } from 'recompose'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { DESK } from '../../../utils/const'
import { addAllMarkers, changeCentre, changeZoom } from '../../../state/ducks/map/actions'
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer"
import { mapStyles } from './MapStyles'



class Map extends Component {
  static propTypes = {
    media: PropTypes.string,
    airMarkers: PropTypes.array,
    visualMarkers: PropTypes.array,
    layers: PropTypes.object,
    centre: PropTypes.object,
    zoomLevel: PropTypes.number,
    addAllMarkers: PropTypes.func,
    changeCentre: PropTypes.func,
    changeZoom: PropTypes.func
  }

  componentDidMount = () => {  
    this.props.addAllMarkers()
  }

  shouldComponentUpdate = (nextProps) => {
    if (this.props.mapCentre !== nextProps.mapCentre
        || this.props.airMarkers !== nextProps.airMarkers
        || this.props.visualMarkers !== nextProps.visualMarkers
        || this.props.layers !== nextProps.layers)
      return true
    else return false    
  }

  handleMarkerClick = (marker, type, e) => {
    let newCentre = {
      lng: parseFloat(marker.long),
      lat: parseFloat(marker.lat)
    }
    this.props.changeCentre(newCentre)
    this.props.history.push({
      pathname: `/dashboard/${marker.lat},${marker.long}`,
      state: { type: type, id: marker.id}
    })
  }

  render() {
    const { layers } = this.props
    // load markers
    let airMarkers=[], visualMarkers=[]
    if (layers.air && this.props.airMarkers !== undefined) {
      airMarkers = this.props.airMarkers.map((marker) => (
        <Marker
          key={marker.id}
          position={{ lng: parseFloat(marker.long), lat: parseFloat(marker.lat) }}
          icon={{ url: require('../../../assets/icons/marker_lvl1.svg') }}
          onClick={(e) => this.handleMarkerClick(marker, "air", e)}
        />
      ))
    }
    if (layers.visual && this.props.visualMarkers !== undefined) {
      visualMarkers = this.props.visualMarkers.map((marker) => (
        <Marker
          key={marker.id}
          position={{ lng: parseFloat(marker.long), lat: parseFloat(marker.lat) }}
          icon={{ url: require('../../../assets/icons/marker_lvl4.svg') }}
          onClick={(e) => this.handleMarkerClick(marker, "visual", e)}
        />
      ))
    }
    const markers = [
      ...airMarkers,
      ...visualMarkers
    ] 
    // TODO: add Markers data + last fetch time to localStorage, test for this before fetch for new data

    const StyledMap = compose(
      withProps({
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ width: `100%`, height: `100%` }} />,
        mapElement: <div style={{ height: `100%`, width:`100%` }} />,
      }),
      shouldUpdate((props, nextProps) => {
        if (props.mapCentre !== nextProps.mapCentre)
          return true
        else if (props.zoomLevel !== nextProps.zoomLevel)
          return true
        else return false
      }),
      withHandlers(() => {
        const refs = {
          map: undefined
        }
    
        return {
          onMarkerClustererClick: () => (markerClusterer) => {
            markerClusterer.getMarkers()
          },
          onMapMounted: () => ref => {
            refs.map = ref
          },
          onZoomChanged: ({ onZoomChange }) => () => {
            onZoomChange(refs.map.getZoom())
          }
        }
      }),
      withGoogleMap
    )(props =>
      <GoogleMap
        defaultCenter={props.mapCentre}
        defaultZoom={props.zoomLevel}
        ref={props.onMapMounted}
        onZoomChanged={props.onZoomChanged}
        defaultOptions={{
          styles: mapStyles,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: (props.media === DESK ? true : false)
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
          {props.markers}
        </MarkerClusterer>
      </GoogleMap>
    )

    return(
      <StyledMap 
        mapCentre={this.props.mapCentre}
        media={this.props.media}
        markers={markers}
        zoomLevel={this.props.zoomLevel}
        onZoomChange={this.props.changeZoom}
      />
    )
  }
}

const mapStateToProps = state => ({
  airMarkers: state.map.airMarkers,
  visualMarkers: state.map.visualMarkers,
  layers: state.map.layers,
  mapCentre: state.map.centre,
  zoomLevel: state.map.zoomLevel
})

const mapDispatchToProps = {
  changeCentre,
  changeZoom,
  addAllMarkers
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Map))