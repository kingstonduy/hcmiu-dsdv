import React, { Component } from 'react';
import './usa_map.css';
import USAMap from "react-usa-map";
import * as d3 from "d3";

class UsaMap extends Component {
    mapHandler = (event) => {
        alert(event.target.dataset.name);
    };

    // Function to generate random numbers from 1 to 100 for each state
    generateRandomNumbers = () => {
        const randomNumbers = {};
        const stateAbbreviations = [
            "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS",
            "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY",
            "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
        ];

        stateAbbreviations.forEach(state => {
            randomNumbers[state] = Math.floor(Math.random() * 100) + 1; // Generate random number between 1 and 100
        });

        return randomNumbers;
    };

    // Function to create a color scale based on the generated numbers
    createColorScale = () => {
        const randomNumbers = this.generateRandomNumbers();
        const values = Object.values(randomNumbers);
        
        // Define the color scale based on the min and max values of generated numbers
        const colorScale = d3.scaleSequential(d3.interpolateReds)
                            .domain([d3.min(values), d3.max(values)]);

        return { randomNumbers, colorScale };
    };

    statesFilling = () => {
        const { randomNumbers, colorScale } = this.createColorScale();
        const fillStates = {};

        // Map each state abbreviation to a color based on its random number
        Object.keys(randomNumbers).forEach(state => {
            const randomNumber = randomNumbers[state];
            fillStates[state] = {
                    fill: colorScale(randomNumber), 
                    title: state.name,
                };
        });

        return fillStates;
    };

    // Function to generate color legend HTML
    generateColorLegend = () => {
        const { colorScale } = this.createColorScale();
        const legendSteps = 10; // Number of steps in the legend
        const stepSize = 100 / legendSteps; // Step size for the legend

        const legendItems = [];
        for (let i = 0; i <= legendSteps; i++) {
            const value = i * 10;
            const color = colorScale(value);
            legendItems.push(
                <div key={i} className="legend-item" style={{ backgroundColor: color }}>
                    {value}
                </div>
            );
        }

        return (
            <div className="legend">
                <div className="legend-title">Color Legend</div>
                <div className="legend-items">
                    {legendItems}
                </div>
            </div>
        );

        return (
            <div className="legend">
                <div className="legend-title">Color Legend</div>
                {legendItems}
            </div>
        );
    };

    render() {
        return (
            <div className="App">
                <h1>USA Map with Random Colors</h1>
                <div className="map-container">
                    <USAMap customize={this.statesFilling()} onClick={this.mapHandler} />
                    {this.generateColorLegend()}
                </div>
            </div>
        );
    }
}

export default UsaMap;
