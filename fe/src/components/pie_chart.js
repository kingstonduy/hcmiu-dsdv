import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useState } from 'react';
import './pie_chart.css'

function PieChart( {rawdata, state} ) {


    const filterByIndustry = () => {
        const industries = {};

        rawdata.forEach(d => {
            if(d.state == state) {
                industries[d.industry]=0
            }
        });

        rawdata.forEach(d => {
            if(d.state == state) {
                industries[d.industry] += Number(d.total_laid_off)
            }
        });

        // Transform the resulting object into an array
        console.log("industries", industries)
        const resultArray = [];
        Object.entries(industries).forEach(([key, val]) => {
            resultArray.push({ label: key, value: val });
        });

        // sorted by value
        resultArray.sort((a, b) => b.value - a.value);
        //take top 10
        resultArray.splice(10);

        console.log("resultArray", resultArray)
        return resultArray;
    };

    const [chartdata, setChartdata] = useState(filterByIndustry());

    const margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
    };

    const width = 500;
    const height = 600;
    const padding = 20;

    const  radius = 200

    const colorScale = d3
        .scaleSequential()
        .interpolator(d3.interpolateCool)
        .domain([0, chartdata.length]);


    const svgRef = useRef();

    function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    function drawChart(filteredData) {
        // Remove the old svg
        d3.select(svgRef.current).selectAll('*').remove();
      
        // Create new svg
        const svg = d3
          .select(svgRef.current)
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', `translate(${width / 2}, ${(height / 2 + 20) })`)
      
        const innerarc = d3.arc().innerRadius(radius * 0.3).outerRadius(radius * 0.7);
        const outerArc = d3.arc().innerRadius(radius * 0.8).outerRadius(radius * 0.8);
      
        const pieGenerator = d3.pie().padAngle(0).value((d) => d.value);
      
        const arc = svg.selectAll().data(pieGenerator(filteredData)).enter();
      
        // Append arcs
        arc
          .append('path')
          .attr('d', innerarc)
          .style('fill', (_, i) => colorScale(i))
          .style('stroke', '#ffffff')
          .style('stroke-width', 0)
          .transition()
          .duration(1000)
          .attrTween('d', function (d) {
            const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
            return function (t) {
              return innerarc(interpolate(t));
            };
          });
      
        /* ------- TEXT LABELS -------*/
        arc
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'middle')
          .text((d) => d.data.label)
          .attr('fill', 'black')
          .attr('font-size', '10px') // Set the font size
          .attr('font-weight', 'bold') // Set the font weight
          .transition()
          .duration(1000)
          .attrTween('transform', function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
              var d2 = interpolate(t);
              var pos = outerArc.centroid(d2);
              pos[0] = radius * (midAngle(d2) < Math.PI  ? 1 : -1);
              return `translate(${pos})`;
            };
          })
          .styleTween('text-anchor', function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
              var d2 = interpolate(t);
              return midAngle(d2) < Math.PI ? 'start' : 'end';
            };
          });
      
        /* ------- SLICE TO TEXT POLYLINES -------*/
        const arcs = arc
          .append('polyline')
          .attr('fill', 'rgb(160, 93, 86)')
          .transition()
          .duration(1000)
          .attrTween('points', function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return [innerarc.centroid(d2), outerArc.centroid(d2), pos];
            };
          })
    }


    useEffect(() => {
        setChartdata(filterByIndustry());
        drawChart(chartdata);
    }, []);

    return (
        <>
            <div className="pie-container">
                <div id="pie-container" c ref={svgRef} />
            </div>
        </>
    );
}

export default PieChart;