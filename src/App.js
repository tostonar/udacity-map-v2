import React, { Component } from 'react';
import './App.css';
import locations from './data/locations.json';
import MapDisplay from './components/MapDisplay';
import ListDrawer from './components/ListDrawer';
import 'typeface-roboto';


class App extends Component {
  state = {
    lat: 29.8937951,
    lon: -81.3098036,
    zoom: 14,
    all: locations,
    filtered: null,
    open: false
  };

  styles = {
    menuButton: {
      marginLeft: 10,
      marginRight: 20,
      position: "absolute",
      left: 10,
      top: 20,
      background: "white",
      padding: 10
    },
    hide: {
      display: 'none'
    },
    header: {
      marginTop: "0px"
    }
  };

  componentDidMount = () => {
    this.setState({
      ...this.state,
      filtered: this.filterLocations(this.state.all, "")
    });
  }

  toggleDrawer = () => {
    // Toggle the value controlling whether the drawer is displayed
    this.setState({
      open: !this.state.open
    });
  }

  updateQuery = (query) => {
    // Update the query value and filter the list of locations accordingly
    this.setState({
      ...this.state,
      selectedIndex: null,
      filtered: this.filterLocations(this.state.all, query)
    });
  }

  filterLocations = (locations, query) => {
    // Filter locations to match query string
    return locations.filter(location => location.name.toLowerCase().includes(query.toLowerCase()));
  }

  clickListItem = (index) => {
    // Set the state to reflect the selected location array index
    this.setState({ selectedIndex: index, open: !this.state.open })
  }

  render = () => {
    return (
      <div className="App">
        <div>
          <button onClick={this.toggleDrawer} style={this.styles.menuButton}>
            <i className="material-icons">filter_list</i>
          </button>
          <h1> St. Augustine, Florida Restaurants</h1>
        </div>
        <MapDisplay
          lat={this.state.lat}
          lon={this.state.lon}
          zoom={this.state.zoom}
          locations={this.state.filtered}
          selectedIndex={this.state.selectedIndex}
          clickListItem={this.clickListItem}/>
        <ListDrawer
          locations={this.state.filtered}
          open={this.state.open}
          toggleDrawer={this.toggleDrawer}
          filterLocations={this.updateQuery}
          clickListItem={this.clickListItem}/>
      </div>
    );
  }
}

export default App;
