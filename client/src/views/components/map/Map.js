import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose, withProps, withHandlers, shouldUpdate } from 'recompose'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { DESK } from '../../../utils/const'
import { addAllMarkers, changeCentre, changeZoom } from '../../../state/ducks/map/actions'
import { getAirData, getVisualData } from '../../../state/ducks/sensor/actions'
import { withGoogleMap, GoogleMap } from 'react-google-maps'
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel'
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer"
import { getAirMarkerLevel, getVisualMarkerLevel, customMarkerLabelStyle } from '../../../utils/markers'
import { mapStyles } from './MapStyles'

class Map extends Component {
  static propTypes = {
    media: PropTypes.string,
    airMarkers: PropTypes.array,
    visualMarkers: PropTypes.array,
    layers: PropTypes.object,
    centre: PropTypes.object,
    zoomLevel: PropTypes.number,
    airAttr: PropTypes.string,
    visualAttr: PropTypes.string,
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
        || this.props.layers !== nextProps.layers
        || this.props.airAttr !== nextProps.airAttr
        || this.props.visualAttr !== nextProps.visualAttr)
      return true
    else return false    
  }

  handleMarkerClick = (marker, type, e) => {
    let newCentre = {
      lng: parseFloat(marker.long),
      lat: parseFloat(marker.lat)
    }
    this.props.changeCentre(newCentre)
    if (type==='air') this.props.getAirData(marker.id)
    else this.props.getVisualData(marker.id)
    this.props.history.push({
      pathname: `/dashboard/${marker.lat},${marker.long}`,
      state: { type: type, id: marker.id}
    })
  }

  _loadMarkers = () => {
    const { layers } = this.props
    let airMarkers=[], visualMarkers=[]
    const max = 1.000001
    const min = 0.999999

    if (layers.air && this.props.airMarkers !== undefined) {
      airMarkers = this.props.airMarkers.map((marker, index) => {
        let lvl = getAirMarkerLevel(this.props.airAttr, marker[this.props.airAttr])
        for (let i = 0; i < index; i++) {
          if (this.props.airMarkers[i].long === marker.long &&
            this.props.airMarkers[i].lat === marker.lat) {
            marker.long = marker.long * (Math.random() * (max - min) + min)
            marker.lat = marker.lat * (Math.random() * (max - min) + min)
            break
          }
        }

        return (
          <MarkerWithLabel
            key={marker.id}
            position={{ lng: parseFloat(marker.long), lat: parseFloat(marker.lat) }}
            icon={{ url: require(`../../../assets/icons/marker_a${lvl}.svg`) }}
            onClick={(e) => this.handleMarkerClick(marker, "air", e)}
            labelAnchor={new window.google.maps.Point(24,-4)}
            labelStyle={customMarkerLabelStyle}
          >
            <div>{marker.name}</div>
          </MarkerWithLabel>
        )
      })
    }

    if (layers.visual && this.props.visualMarkers !== undefined) {
      visualMarkers = this.props.visualMarkers.map((marker, index) => {
        let lvl = getVisualMarkerLevel(this.props.visualAttr, marker[this.props.visualAttr])
        for (let i = 0; i < index; i++) {
          if (this.props.visualMarkers[i].long === marker.long &&
            this.props.visualMarkers[i].lat === marker.lat) {
            marker.long = marker.long * (Math.random() * (max - min) + min)
            marker.lat = marker.lat * (Math.random() * (max - min) + min)
            break
          }
        }

        return (
          <MarkerWithLabel
            key={marker.id}
            position={{ lng: parseFloat(marker.long), lat: parseFloat(marker.lat) }}
            icon={{ url: require(`../../../assets/icons/marker_v${lvl}.svg`) }}
            onClick={(e) => this.handleMarkerClick(marker, "visual", e)}
            labelAnchor={new window.google.maps.Point(24,-4)}
            labelStyle={customMarkerLabelStyle}
          >
            <div>{marker.name}</div>
          </MarkerWithLabel>
        )
      })
    }
    
    return [
      ...airMarkers,
      ...visualMarkers
    ] 
  }

  render() {
    const markers = this._loadMarkers()

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
          maxZoom={16}
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
  zoomLevel: state.map.zoomLevel,
  airAttr: state.map.airAttr,
  visualAttr: state.map.visualAttr
})

const mapDispatchToProps = {
  changeCentre,
  changeZoom,
  addAllMarkers,
  getAirData,
  getVisualData
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Map))