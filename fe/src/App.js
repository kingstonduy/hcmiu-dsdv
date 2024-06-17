import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./components/home";
import Blogs from "./components/blog";
import Contact from "./components/contact";
import NoPage from "./components/noPage";
import Example from "./components/example";
import UsaMap from "./components/usa_map";

export default function App() {
    return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="*" element={<NoPage />} />
                <Route index element={<Home />} />
                <Route path="blogs" element={<Blogs />} />
                <Route path="contact" element={<Contact />} />
                <Route path="example" element={<Example />} />
                <Route path="map" element={<UsaMap />} />
            </Route>
        </Routes>
    </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);