import SmoothScroll from "smooth-scroll";
import Layout from "./components/layout";
import Home from "./components/home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UsaMap from "./components/usa_map";
import { useEffect, useState } from "react";
import * as d3 from "d3";
import PieChart from "./components/pie_chart";
import Barchart from "./components/bar_chart";




export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
    const [dataset, setData] = useState([]);

    useEffect(() => {
        d3.csv('https://raw.githubusercontent.com/tej17/CSE-564-US-Layoffs-Visualization/master/backend/data.csv').then((csvData) => {
            setData(csvData);
        }).catch((error) => {
            console.error('Error loading CSV data:', error);
        });
    }, []);

    // // loop through the data set
    // dataset.forEach((d) => {
    //     console.log(d);
    // });

    // random index of csvData
    
    function getRandomStateAbbreviations(numberOfStates) {
        const stateAbbreviations = {
          Alabama: "AL",
          Alaska: "AK",
          Arizona: "AZ",
          Arkansas: "AR",
          California: "CA",
          Colorado: "CO",
          Connecticut: "CT",
          Delaware: "DE",
          Florida: "FL",
          Georgia: "GA",
          Hawaii: "HI",
          Idaho: "ID",
          Illinois: "IL",
          Indiana: "IN",
          Iowa: "IA",
          Kansas: "KS",
          Kentucky: "KY",
          Louisiana: "LA",
          Maine: "ME",
          Maryland: "MD",
          Massachusetts: "MA",
          Michigan: "MI",
          Minnesota: "MN",
          Mississippi: "MS",
          Missouri: "MO",
          Montana: "MT",
          Nebraska: "NE",
          Nevada: "NV",
          "New Hampshire": "NH",
          "New Jersey": "NJ",
          "New Mexico": "NM",
          "New York": "NY",
          "North Carolina": "NC",
          "North Dakota": "ND",
          Ohio: "OH",
          Oklahoma: "OK",
          Oregon: "OR",
          Pennsylvania: "PA",
          "Rhode Island": "RI",
          "South Carolina": "SC",
          "South Dakota": "SD",
          Tennessee: "TN",
          Texas: "TX",
          Utah: "UT",
          Vermont: "VT",
          Virginia: "VA",
          Washington: "WA",
          "West Virginia": "WV",
          Wisconsin: "WI",
          Wyoming: "WY"
        };
      
        const stateNames = Object.keys(stateAbbreviations);
      
        if (numberOfStates >= stateNames.length) {
          return Object.values(stateAbbreviations);
        }
      
        const shuffledAbbreviations = stateNames.sort(() => 0.5 - Math.random());
        const selectedAbbreviations = shuffledAbbreviations.slice(0, numberOfStates).map(state => stateAbbreviations[state]);
        return selectedAbbreviations;
      }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="map" element={<UsaMap data={dataset}/>} />
                    <Route path="piechart" element={<PieChart rawdata={dataset} state="OH" />} />
                    <Route path="barchart" element={<Barchart rawdata={dataset} state="OH" />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;