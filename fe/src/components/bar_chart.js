import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import './bar_chart.css';

function Barchart({ rawdata, state }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const filterByCompany = () => {
      const companies = {};

      rawdata.forEach((d) => {
        if (d.state === state) {
          if (!companies[d.company]) {
            companies[d.company] = 0;
          }
          companies[d.company] += Number(d.total_laid_off);
        }
      });

        const resultArray = [];
        Object.entries(companies).forEach(([key, val]) => {
            resultArray.push({ label: key, value: val });
        });

        // sorted by value
        resultArray.sort((a, b) => b.value - a.value);
        //take top 10
        resultArray.splice(10);

        console.log("resultArray", resultArray)
        return resultArray;
    };

    const filteredData = filterByCompany();
    setChartData(filteredData);
  }, [rawdata, state]);

  return (
    <div className="bar_chart">
      <BarChart
        xAxis={[{ scaleType: 'band', data: chartData.map((d) => d.label) }]}
        series={[
          {
            data: chartData.map((d) => d.value),
          },
        ]}
        width={1000}
        height={300}
        barLabel="value"
      />
    </div>
  );
}

export default Barchart;