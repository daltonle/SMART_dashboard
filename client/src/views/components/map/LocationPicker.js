import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose, withProps, withHandlers } from 'recompose'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { DESK } from '../../../utils/const'
import { addAllMarkers, changeCentre } from '../../../state/ducks/map/actions'
import { addCompareSensor } from '../../../state/ducks/compare/actions'
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps'
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer"
import { LocationCard } from './LocationCard'
import { mapStyles } from './MapStyles'

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
    defaultCenter={props.mapCentre}
    defaultZoom={13}
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

class LocationPicker extends Component {
  static propTypes = {
    media: PropTypes.string,
    airMarkers: PropTypes.array,
    visualMarkers: PropTypes.array,
    sensorType: PropTypes.string,
    mapCentre: PropTypes.object,
    selectedSensors: PropTypes.array,
    count: PropTypes.number,
    addAllMarkers: PropTypes.func,
    addCompareSensor: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      cardVisible: false,
      addable: true,
      selectedLocation: {
        id: "",
        name: "",
        suburb: "",
        position: {
          lat: 0,
          lng: 0
        }
      }
    }
  }

  componentDidMount = () => {  
    this.props.addAllMarkers()
  }

  handleMarkerClick = (marker, type) => {
    fetch(`/sensors/${type}/coordinates=${marker.long},${marker.lat}`)
    .then(res => res.text())
    .then(text => text.length ? JSON.parse(text) : undefined)
    .then(res => {
      if (this.props.selectedSensors.find(s => s.id === res.id))
        this.setState({ addable: false })
      else this.setState({ addable: true })

      this.setState({
        selectedLocation: {
          id: res.id,
          name: res.description,
          suburb: "No location data",
          position: {
            lat: res.lat,
            lng: res.long
          }
        }
      })

      this.setState({ cardVisible: true })
    })
    .catch(err => console.log(err))
  }

  handleLocationAdded = () => {
    this.props.addCompareSensor(this.state.selectedLocation.id, this.state.selectedLocation.name, this.props.sensorType)
    this.setState({ cardVisible: false })
    // TODO: display success message on added
  }

  handleLocationCardCollapse = () => {
    this.setState({ cardVisible: false })
  }

  render() {
    const { sensorType } = this.props

    // load markers
    let markers
    if (sensorType==='air' && this.props.airMarkers !== undefined) {
      markers = this.props.airMarkers.map((marker, index) => (
        <Marker
          key={index}
          position={{ lng: parseFloat(marker.long), lat: parseFloat(marker.lat) }}
          icon={{ url: require('../../../assets/icons/marker_1.svg') }}
          onClick={() => this.handleMarkerClick(marker, 'air')}
        />
      ))
    }
    if (sensorType==='visual' && this.props.visualMarkers !== undefined) {
      markers = this.props.visualMarkers.map((marker, index) => (
        <Marker
          key={index}
          position={{ lng: parseFloat(marker.long), lat: parseFloat(marker.lat) }}
          icon={{ url: require('../../../assets/icons/marker_4.svg') }}
          onClick={() => this.handleMarkerClick(marker, 'visual')}
        />
      ))
    }
    // TODO: add Markers data + last fetch time to localStorage, test for this before fetch for new data

    const { selectedLocation, cardVisible, addable } = this.state

    return(
      <div style={{ height: `100%`, width:`100%`, position: `relative` }}>
        <StyledMap 
          mapCentre={this.props.mapCentre}
          media={this.props.media}
          markers={markers}
        />
        <LocationCard 
          visible={cardVisible} 
          name={selectedLocation.name} 
          suburb={selectedLocation.suburb}
          position={selectedLocation.position}
          addable={addable}
          maxed={this.props.count >= 5}
          onExit={this.handleLocationCardCollapse}
          onLocationAdded={this.handleLocationAdded}
          media={this.props.media}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  airMarkers: state.map.airMarkers,
  visualMarkers: state.map.visualMarkers,
  sensorType: state.compare.type,
  mapCentre: state.map.centre,
  selectedSensors: state.compare.sensors,
  count: state.compare.count
})

const mapDispatchToProps = {
  addAllMarkers,
  changeCentre,
  addCompareSensor
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LocationPicker))