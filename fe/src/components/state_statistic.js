import logo from '../logo.svg';
import './state_statistic.css';
import { useEffect, useState, useRef } from 'react';
import * as d3 from "d3";

export const StateStatistic = ( {rawdata, state} ) => {
    let numberLayoff = 0;


    const getStateFullName = (stateAbbreviation) => {
        const stateMap = {
            AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
            CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
            HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
            KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
            MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
            MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
            NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
            OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
            SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
            VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming'
        };
    
        return stateMap[stateAbbreviation] || stateAbbreviation; // Return full name or original abbreviation if not found
    };

    // Function to get the month from a date string in the format "DD/MM/YY"
    const getMonth = (dateStr) => {
        const [day, month, year] = dateStr.split('/');
        return parseInt(month, 10); // Convert month to an integer
    };
    
    // Helper function to determine the season for a given date
    const getSeason = (date) => {
        console.log(date)
        const month = getMonth(date)
        if (month < 3 || month === 11) return 'Winter';
        if (month < 6) return 'Spring';
        if (month < 9) return 'Summer';
        return 'Fall';
    };
    
    // key = month, value = total_laid_off
    const filterByMonth = () => {
        const months = {};
        for (let i = 1; i <= 12; i++) {
            months[i] = 0;
        }

        rawdata.forEach(d => {
            if(d.state == state) {
                const month = getMonth(d.date);
                months[month] += Number(d.total_laid_off);
                numberLayoff += Number(d.total_laid_off);
            }
            
        });

        // Transform the resulting object into an array
        const resultArray = [];
        for (let i = 1; i <= 12; i++) {
            if (months.hasOwnProperty(i)) {
                resultArray.push({month: i, total_laid_off: months[i]});
            }
        }

        console.log("resultArray", resultArray)
        return resultArray;
    };

    const width = 500;
    const height = 150;
    const padding = 20;

    const [chartdata, setChartdata] = useState(filterByMonth());
    const svgRef = useRef();


    const drawChart = (filteredData) => {
        const xScale = d3.scalePoint()
            .domain(filteredData.map(d => d.month))
            .range([50, width - padding]);
    
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(filteredData, d => d.total_laid_off)])
            .range([height - padding, padding]);
    
        const line = d3.line()
            .x(d => xScale(d.month))
            .y(d => yScale(d.total_laid_off))
            .curve(d3.curveMonotoneX);
    
        const svg = d3.select(svgRef.current);
        const path = svg.selectAll('path')
            .data([filteredData]);
    
        path.enter()
            .append('path')
            .merge(path)
            .attr('fill', 'none')
            .attr('stroke', 'grey')
            .attr('stroke-width', 5)
            .attr('d', line)
            .attr('stroke-dasharray', function() { return this.getTotalLength(); })
            .attr('stroke-dashoffset', function() { return this.getTotalLength(); })
            .transition()
            .duration(2000)
            .attr('stroke-dashoffset', 0)
            .on('end', function() {
                // Animation complete callback
                svg.selectAll('.label').remove(); // Remove existing labels
    
                // Add labels for each point
                svg.selectAll('.label')
                    .data(filteredData)
                    .enter()
                    .append('text')
                    .attr('class', 'label')
                    .attr('x', d => xScale(d.month))
                    .attr('y', d => yScale(d.total_laid_off) - 10) // Adjust position above the point
                    .text(d => d.total_laid_off.toFixed(0)) // Display total_laid_off, rounded to integer
                    .attr('text-anchor', 'middle')
                    .attr('alignment-baseline', 'middle')
                    .attr('fill', 'black')
                    .style('font-size', '10px'); // Set font size to 12px
            });
    
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale).ticks(5);
    
        svg.select('#xaxis').remove();
        svg.append('g')
            .attr('transform', `translate(0,${height - padding})`)
            .attr('id', 'xaxis')
            .call(xAxis);
    
        svg.select('#yaxis').remove();
        svg.append('g')
            .attr('transform', `translate(${50},0)`)
            .attr('id', 'yaxis')
            .call(yAxis);
    };
    

    useEffect(() => {
        setChartdata(filterByMonth());
        drawChart(chartdata);
    }, []);

    return (
        <div class="grid-container">
            <div class="grid-item">
                <div className='grid1_item1'>
                    <p className=''>State: {getStateFullName(state)}</p>
                    <p className=''>Total number of Layoff: {numberLayoff}</p>
                </div>
                <svg id="chart" ref={svgRef} className="chart_state_num_layoff">
                    <path d="" fill="none" stroke="white" strokeWidth="5" />
                </svg> 
            </div>
            <div class="grid-item">Top Right</div>
            <div class="grid-item">
                Bottom Left
            </div>
            <div class="grid-item">Bottom Right</div>
    </div>
    );
};

