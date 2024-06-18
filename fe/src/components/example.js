import logo from '../logo.svg';
import './example.css';
import { useEffect, useState, useRef } from 'react';
import * as d3 from "d3";

export const Example = () => {

  //  1] Setup Initial data and settings ------------//
  const initialData = [
    { name: "Car", value: 10 },
    { name: "Food", value: 3 },
    { name: "Telephone", value: 9 },
    { name: "Electricity", value: 7 },
    { name: "Cinema", value: 7 },
  ];

  const width = 500;
  const height = 150;
  const padding = 20;
  const maxValue = 20; // Maximum data value

  const [chartdata, setChartdata] = useState(initialData);
  const svgRef = useRef();

  //  2] Setup random data generator and SVG canvas -//
  const newData = () => chartdata.map(d => {
    d.value = Math.floor(Math.random() * (maxValue + 1));
    return d;
  });

  const drawChart = (data) => {
    const xScale = d3.scalePoint()
      .domain(data.map(d => d.name))
      .range([padding, width - padding]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([height - padding, padding]);

    const line = d3.line()
      .x(d => xScale(d.name))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    const svg = d3.select(svgRef.current);
    const path = svg.selectAll('path')
      .data([data]);

    path.enter()
      .append('path')
      .merge(path)
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-width', 5)
      .attr('d', line)
      .attr('stroke-dasharray', function() { return this.getTotalLength(); })
      .attr('stroke-dashoffset', function() { return this.getTotalLength(); })
      .transition()
      .duration(2000)
      .attr('stroke-dashoffset', 0);

    path.exit().remove();

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.select('#xaxis').remove();
    svg.append('g')
      .attr('transform', `translate(0,${height - padding})`)
      .attr('id', 'xaxis')
      .call(xAxis);

    svg.select('#yaxis').remove();
    svg.append('g')
      .attr('transform', `translate(${padding},0)`)
      .attr('id', 'yaxis')
      .call(yAxis);
  };

  useEffect(() => {
    drawChart(chartdata);
  }, []);

  useEffect(() => {
    drawChart(chartdata);
  }, [chartdata]);

  return (
    <div className="App">
      <header className="App-header">

        <svg id="chart" ref={svgRef} viewBox="0 0 500 150">
          <path d="" fill="none" stroke="white" strokeWidth="5" />
        </svg>
        <p>
          <button type="button" onClick={() => setChartdata(newData())}>
            Click to refresh expenses data
          </button>
        </p>

      </header>
    </div>
  );
};
