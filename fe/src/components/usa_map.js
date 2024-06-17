import React, { Component } from 'react';
import './usa_map.css';
import USAMap from "react-usa-map";

class UsaMap extends Component {
  mapHandler = (event) => {
    alert(event.target.dataset.name);
  };

  statesFilling = () => {
    return {
      "NJ": {
        fill: "navy",
        clickHandler: () => alert("Custom callback for the NJ state")
      },
      "NY": {
        fill: "#CC0000"
      }
    };
  };

  render() {
    return (
      <div className="App">
        <h1>react-usa-map</h1>
        <USAMap customize={this.statesFilling()} onClick={this.mapHandler} />
        <p>More information: <a href="http://github.com/gabidavila/react-usa-map">GitHub</a></p>
      </div>
    );
  }
}

export default UsaMap;