import React, { Component } from 'react';
import './App.css';
import locations from './data/locations.json';
import MapDisplay from './components/MapDisplay';


class App extends Component {
  state = {
    lat: 29.8937951,
    lon: -81.3098036,
    zoom: 16,
    all: locations
  };

  render = () => {
    return (
      <div className="App">
        <div>
          <h1> St.Augustine, Fl Restaurants</h1>
        </div>
        <MapDisplay
          lat={this.state.lat}
          long={this.state.lon}
          zoom={this.state.zoom}
          locations={this.state.all}/>
      </div>
    );
  }
}

export default App;
