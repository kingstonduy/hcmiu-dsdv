import React, { useEffect, useState } from 'react';
import './usa_map.css';
import USAMap from "react-usa-map";
import * as d3 from "d3";
import { StateStatistic } from './state_statistic';

const UsaMap = ({ data }) => {
    const [fillStates, setFillStates] = useState({});
    const [legendItems, setLegendItems] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const [filteredData, setFilteredData] = useState(null);

    // gộp lại theo state và tính tổng số người mất việc
    const getNumberOfLaidOffPerState = (data) => {
        const res = {};
        data.forEach(d => {
            if (res[d.state]) {
                // convert to int then add
                res[d.state].total_laid_off += Number(d.total_laid_off);
            } else {
                res[d.state] = {
                    state: d.state,
                    total_laid_off: Number(d.total_laid_off),
                };
            }
        });
        // Transform the resulting object into an array
        const resultArray = [];
        for (const state in res) {
            if (res.hasOwnProperty(state)) {
                resultArray.push(res[state]);
            }
        }

        return resultArray;
    }

    // Function to handle click on a state in the map
    const mapHandler = (event) => {
        const stateName = event.target.dataset.name;
        setSelectedState(event.target.dataset.name);
        // const filtered = data.filter(d => d.state === stateName);
        // if (filtered.length > 0) {
        //     setFilteredData(filtered);
        // } 
    };

    // Effect to set up the color scale and legend items
    useEffect(() => {
        const arr = getNumberOfLaidOffPerState(data);

        // Function to create color scale based on total_laid_off values
        const createColorScale = () => {
            const values = arr.map(d => d.total_laid_off); // Convert total_laid_off to numbers
            const colorScale = d3.scaleSequential(d3.interpolateReds)
                                .domain([d3.min(values), d3.max(values)]);
            return colorScale;
        };

        // Generate fillStates object for react-usa-map
        const generateFillStates = (colorScale) => {
            const newFillStates = {};
            arr.forEach(d => {
                newFillStates[d.state] = {
                    fill: colorScale(+d.total_laid_off),
                    title: d.state,
                };
            });
            return newFillStates;
        };

        const colorScale = createColorScale();
        const fillStates = generateFillStates(colorScale);

        setFillStates(fillStates);

        const values = arr.map(d => d.total_laid_off); // Convert total_laid_off to numbers

        const legendItems = [];
        const mx = d3.max(values);
        const num = 10
        for (let i = 0; i <= mx; i += (mx) / num) {
            const value = parseInt(i);
            const color = colorScale(value);
            legendItems.push(
                <div key={value} className="legend-item" style={{ backgroundColor: color }}>
                    {value}
                </div>
            );
        }

        setLegendItems(legendItems);
    }, []);


    return (
        <div className="usa_page">
            <div className="map-container">
                <center>
                    <h1>USA Map with Colors</h1>
                    <USAMap customize={fillStates} onClick={mapHandler} className="usa_map"   style={{ width: '50%', height: '500px' }}/>

                    <div className="legend">
                        <div className="legend-items">
                            {legendItems}
                        </div>
                    </div>
                </center>
               
                
            </div>
            {selectedState != null&& (
                <div className="statistic-container">
                    <div className='cls_btn_div'>
                        <button type="button" size="30px" class="btn-close" aria-label="Close" onClick={() => setSelectedState(null)}>X</button>
                    </div>

                    <div className="state-data">
                        <StateStatistic rawdata={data} state = {selectedState}/>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UsaMap;

