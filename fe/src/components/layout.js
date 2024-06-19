import { Outlet, Link } from "react-router-dom";

import './layout.css'

const Layout = () => {
  return (
    <div>
        <nav>
            <ul className="nav_bar">
                <li>
                    <Link className="nav_bar_link" to="/">Home</Link>
                </li>
                <li>
                    <Link className="nav_bar_link" to="/map">Map</Link>
                </li>
                <li>
                    <Link className="nav_bar_link" to="/piechart">Pie Chart</Link>
                </li>
            </ul>
        </nav>

        <Outlet />
    </div>
  )
};

export default Layout;