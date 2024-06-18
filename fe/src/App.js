import SmoothScroll from "smooth-scroll";
import { Example } from "./components/example";
import Layout from "./components/layout";
import Home from "./components/home";
import Blogs from "./components/blog";
import Contact from "./components/contact";
import NoPage from "./components/noPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UsaMap from "./components/usa_map";
import { useEffect, useState } from "react";
import * as d3 from "d3";



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
    
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="*" element={<NoPage />} />
                    <Route index element={<Home />} />
                    <Route path="blogs" element={<Blogs />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="example" element={<Example />} />
                    <Route path="map" element={<UsaMap data={dataset}/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;