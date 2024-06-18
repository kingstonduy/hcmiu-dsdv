import React, { useEffect, useState } from 'react';
import './usa_map.css';
import USAMap from "react-usa-map";
import * as d3 from "d3";

const UsaMap = ({ data }) => {
    const [fillStates, setFillStates] = useState({});
    const [legendItems, setLegendItems] = useState([]);

    const mapHandler = (event) => {
        alert(event.target.dataset.name);
    };

    useEffect(() => {

        data.forEach((d) => {
            console.log(d);
        });


        const generateRandomNumbers = () => {
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

        const createColorScale = () => {
            const randomNumbers = generateRandomNumbers();
            const values = Object.values(randomNumbers);
            
            // Define the color scale based on the min and max values of generated numbers
            const colorScale = d3.scaleSequential(d3.interpolateReds)
                                .domain([d3.min(values), d3.max(values)]);

            return { randomNumbers, colorScale };
        };

        const { randomNumbers, colorScale } = createColorScale();
        const newFillStates = {};

        // Map each state abbreviation to a color based on its random number
        Object.keys(randomNumbers).forEach(state => {
            const randomNumber = randomNumbers[state];
            newFillStates[state] = {
                fill: colorScale(randomNumber),
                title: state.name,
            };
        });

        setFillStates(newFillStates);

        const legendSteps = 10; // Number of steps in the legend
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

        setLegendItems(legendItems);
    }, [data]);

    return (
        <div className="App">
            <h1>USA Map with Random Colors</h1>
            <div className="map-container">
                <USAMap customize={fillStates} onClick={mapHandler} />
                <div className="legend">
                    <div className="legend-title">Color Legend</div>
                    <div className="legend-items">
                        {legendItems}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsaMap;
