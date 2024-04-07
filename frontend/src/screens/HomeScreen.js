import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import Product from "../components/Product";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import SearchBox from "../components/SearchBox";
import SearchScreen from '../screens/SearchScreen';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

// import data from '../data';

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });
  const [Eyeglass, setEyeglass] = useState([]);
  const [SunGlass, setSunGlass] = useState([]);
  const [sportsGlasses, setsportsGlasses] = useState([]);

  
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("https://opticals-ecommerce.vercel.app/api/products");

        const eyeglassesData = result.data.filter(product => product.category === "eyeglasses");
        const sunglassesData = result.data.filter(product => product.category === "sunglasses");
        const sportglassesData = result.data.filter(product => product.category === "sportsGlasses");
        setsportsGlasses(sportglassesData)
        setEyeglass(eyeglassesData);
        setSunGlass(sunglassesData);
        
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }

      // setProducts(result.data);
    };
    fetchData();
  }, []);


  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4.5,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  // function handleEyeGlasses(){
  //   navigator("/search")
  // }


  return (
    <div>
      <Helmet>
        <title>Royal Opticals</title>
      </Helmet>
      {/* <h1>Featured Products</h1> */}
      {/* <SearchBox />  */}
      {/* <SearchScreen /> */}

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (

        <>
        <div style={{marginTop: "30px"}}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <h3>Eye Glasses</h3>
            <Link to={"/search?category=eyeglasses&query=all&price=all&rating=all&order=newest&page=1"}>
            <button>View All</button>
            </Link>
            
          </div>
          <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={9000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={1000}
            containerClass="carousel-container"
            removeArrowOnDeviceType={['tablet', 'mobile']}
            deviceType="desktop"
          >

            {Eyeglass.map((product) => (
              <>
                  <Product product={product}></Product>
              </>
            ))}
          </Carousel>

        </div>
        <div style={{marginTop: "50px"}}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <h3>Sunglasses</h3>
            <Link to={"/search?category=sunglasses&query=all&price=all&rating=all&order=newest&page=1"}>
            <button>View All</button>
            </Link>
          </div>
          <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={9000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={2000}
            containerClass="carousel-container"
            removeArrowOnDeviceType={['tablet', 'mobile']}
            deviceType="desktop"
          >

            {SunGlass.map((product) => (
              <>
               <Product product={product}></Product>
              </>
            ))}
          </Carousel>

        </div>
        <div style={{marginTop: "50px"}}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <h3>Sportglasses</h3>
            <Link to={"/search?category=sportsGlasses&query=all&price=all&rating=all&order=newest&page=1"}>
            <button>View All</button>
            </Link>
          </div>
          <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={2000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={2000}
            containerClass="carousel-container"
            removeArrowOnDeviceType={['tablet', 'mobile']}
            deviceType="desktop"
          >

            {sportsGlasses.map((product) => (
              <>
               <Product product={product}></Product> 
              </>
            ))}
          </Carousel>

        </div>
        </>

      )}

    </div>
  );
}
export default HomeScreen;
