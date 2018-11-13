import React, {Component} from 'react';
import {Map, InfoWindow, GoogleApiWrapper} from 'google-maps-react';
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

  componentWillReceiveProps = (props) => {
        this.setState({firstDrop: false});

        // Change in the number of locations, so update the markers
        if (this.state.markers.length !== props.locations.length) {
            this.closeInfoWindow();
            this.updateMarkers(props.locations);
            this.setState({activeMarker: null});

            return;
        }

        // The selected item is not the same as the active marker, so close the info window
        if (!props.selectedIndex || (this.state.activeMarker &&
            (this.state.markers[props.selectedIndex] !== this.state.activeMarker))) {
            this.closeInfoWindow();
        }

        // Make sure there's a selected index
        if (props.selectedIndex === null || typeof(props.selectedIndex) === "undefined") {
            return;
        };

        // Treat the marker as clicked
        this.onMarkerClick(this.state.markerProps[props.selectedIndex], this.state.markers[props.selectedIndex]);
    }

  mapReady = (props, map) => {
    this.setState({map});
    this.updateMarkers(this.props.locations);
  }

  closeInfoWindow = () => {
    this.state.activeMarker && this.state.activeMarker.setAnimation(null);
    this.setState({showingInfoWindow: false, activeMarker: null, activeMarkerProps: null});
  }

  getBusinessInfo = (props, data) => {
        // Look for matching restaurant data in FourSquare compared to what we already
        // know
        return data
            .response
            .venues
            .filter(item => item.name.includes(props.name) || props.name.includes(item.name));
    }

  onMarkerClick = (props, marker, e) => {
        // Close any info window already open
        this.closeInfoWindow();

        // Fetch the FourSquare data for the selected restaurant

        // get info from foursquare that matches restaurant within 100 meters
        let url = `https://api.foursquare.com/v2/venues/search?client_id=${FS_CLIENT}&client_secret=${FS_SECRET}&v=${FS_VERSION}&radius=100&ll=${props.position.lat},${props.position.lng}&llAcc=100`;
        let headers = new Headers();
        let request = new Request(url, {
            method: 'GET',
            headers
        });

        // Create props for the active marker
        let activeMarkerProps;
        fetch(request)
            .then(response => response.json())
            .then(result => {
                // Get just the business reference for the restaurant we want from the FourSquare
                // return
                let restaurant = this.getBusinessInfo(props, result);
                activeMarkerProps = {
                    ...props,
                    foursquare: restaurant[0]
                };

                // Get the list of images for the restaurant if we got FourSquare data, or just
                // finishing setting state with the data we have
                if (activeMarkerProps.foursquare) {
                    let url = `https://api.foursquare.com/v2/venues/${restaurant[0].id}/photos?client_id=${FS_CLIENT}&client_secret=${FS_SECRET}&v=${FS_VERSION}`;
                    fetch(url)
                        .then(response => response.json())
                        .then(result => {
                            activeMarkerProps = {
                                ...activeMarkerProps,
                                images: result.response.photos
                            };
                            if (this.state.activeMarker)
                                this.state.activeMarker.setAnimation(null);
                            marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
                            this.setState({showingInfoWindow: true, activeMarker: marker, activeMarkerProps});
                        })
                } else {
                    marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
                    this.setState({showingInfoWindow: true, activeMarker: marker, activeMarkerProps});
                }
            })
    }

    updateMarkers = (locations) => {
          // If all the locations have been filtered then we're done
          if (!locations)
              return;

          // Clear map
          this.state.markers.forEach(marker => marker.setMap(null));

          // Iterate over the locations to create parallel references to marker properties
          // and the markers themselves that can be used for reference in interactions.
          // Add the markers to the map along the way.
          let markerProps = [];
          let markers = locations.map((location, index) => {
              let mProps = {
                  key: index,
                  index,
                  name: location.name,
                  position: location.pos,
                  street: location.street,
                  city: location.city,
                  state: location.state,
                  zipcode: location.zip,
                  url: location.url
              };
              markerProps.push(mProps);

              let animation = this.state.firstDrop ? this.props.google.maps.Animation.DROP : null;
              let marker = new this.props.google.maps.Marker(
                {position: location.pos, map: this.state.map, animation}
              );
              marker.addListener('click', () => {
                  this.onMarkerClick(mProps, marker, null);
              });
              return marker;
          })

          this.setState({markers, markerProps});
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
        <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
            onClose={this.closeInfoWindow}>
            <div>
                <h3>{amProps && amProps.name}</h3>
                <p>{amProps && amProps.street}</p>
                {amProps && amProps.url
                    ? (
                        <a href={amProps.url}>Learn more</a>
                    )
                    : ""}
                {amProps && amProps.images
                    ? (
                        <div><img
                            alt={amProps.name + " food picture"}
                            src={amProps.images.items[0].prefix + "100x100" + amProps.images.items[0].suffix}/>
                            <p>Image from Foursquare</p>
                        </div>
                    )
                    : ""
                }
            </div>
        </InfoWindow>
      </Map>
    )
  }
}

export default GoogleApiWrapper({apiKey: MAP_KEY, LoadingContainer: NoMapDisplay})(MapDisplay)
