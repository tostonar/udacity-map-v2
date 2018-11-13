import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import './ListDrawer.css';

class ListDrawer extends Component {
    state = {
        open: false,
        query: ""
    }


    updateQuery = (newQuery) => {
        // Save the new query string in state and pass the string
        // up the call tree
        this.setState({ query: newQuery });
        this.props.filterLocations(newQuery);
    }

    render = () => {
        return (
            <div>
                <Drawer open={this.props.open} onClose={this.props.toggleDrawer}>
                    <div className="list">
                        <input
                            className="filterEntry"
                            type="text"
                            placeholder="Filter list"
                            name="filter"
                            onChange={e => this
                                .updateQuery(e.target.value)}
                            value={this.state.query} />
                        <ul className="noBullets">
                            {this.props.locations && this
                                .props
                                .locations
                                .map((location, index) => {
                                    return (
                                        <li className="listItem" key={index}>
                                            <button className="listLink" key={index} onClick={e => this.props.clickListItem(index)}>{location.name}</button>
                                        </li>
                                    )
                                })}
                        </ul>
                    </div>
                </Drawer>
            </div>
        )
    }
}

export default ListDrawer;
