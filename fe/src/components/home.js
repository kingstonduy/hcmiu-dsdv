import home_image from '../data/lay_off.png'
import './home.css'

const Home = () => {
    return (
        <div className="home_body">
             <img src={home_image} alt="Hero Image" className="hero-image"/> 
        </div>
    )
};
  
  export default Home;