import React, {Component} from 'react';
import {Map, GoogleApiWrapper} from 'google-maps-react';
import NoMapDisplay from './NoMapDisplay';

const MAP_KEY = "AIzaSyDl0JBTHHhsn-lU5Mv9KxWKGFEsrmAp2s4";
const FS_CLIENT = "EDRRVXR4O4AZ5IJZZ0FVZTKSO5MIPGZLDFYDATA2C1MYTKLK";
const FS_SECRET = "30LQLN51VVMPZBT0QLKYMK0QB5XU4Y4U4ZYSLDDUX3DSWKFQ";
const FS_VERSION = "20182507";

class MapDisplay extends Component {
  state = {
    map: null,
    markers: [],
    markerProps: [],
    activeMarker: null,
    activeMarkerProps: null,
    showingInfoWindow: false
  };
  mapReady = (props, map) => {
    this.setState({map});
  }

  render = () => {
    const style = {
      width: '100%',
      height: '100%'
    }
    const center = {
      lat: this.props.lat,
      lng: this.props.lon
    }
    let amProps = this.state.activeMarkerProps;

    return (
      <Map
        role="application"
        aria-label="map"
        onReady={this.mapReady}
        google={this.props.google}
        zoom={this.props.zoom}
        style={style}
        initialCenter={center}
        onClick={this.closeInfoWindow}>
      </Map>
    )
  }
}

export default GoogleApiWrapper({apiKey: MAP_KEY})(MapDisplay)
